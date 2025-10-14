import type { Route, Token, TokensResponse } from '@lifi/sdk'
import {
  ChainType,
  convertQuoteToRoute,
  getContractCallsQuote,
  getRelayerQuote,
  getRoutes,
  isGaslessStep,
  LiFiErrorCode,
} from '@lifi/sdk'
import { useAccount } from '@lifi/wallet-management'
import { useChainTypeFromAddress } from '@lifi/widget-provider'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useMemo } from 'react'
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js'
import { useFieldValues } from '../stores/form/useFieldValues.js'
import { useIntermediateRoutesStore } from '../stores/routes/useIntermediateRoutesStore.js'
import { useSetExecutableRoute } from '../stores/routes/useSetExecutableRoute.js'
import { defaultSlippage } from '../stores/settings/createSettingsStore.js'
import { useSettings } from '../stores/settings/useSettings.js'
import { WidgetEvent } from '../types/events.js'
import { parseUnits } from '../utils/parse.js'
import { getQueryKey } from '../utils/queries.js'
import { useChain } from './useChain.js'
import { useDebouncedWatch } from './useDebouncedWatch.js'
import { useGasRefuel } from './useGasRefuel.js'
import { useIsBatchingSupported } from './useIsBatchingSupported.js'
import { useSwapOnly } from './useSwapOnly.js'
import { useToken } from './useToken.js'
import { useWidgetEvents } from './useWidgetEvents.js'

const refetchTime = 60_000

interface RoutesProps {
  observableRoute?: Route
}

export const useRoutes = ({ observableRoute }: RoutesProps = {}) => {
  const {
    subvariant,
    subvariantOptions,
    sdkConfig,
    contractTool,
    bridges,
    exchanges,
    fee,
    feeConfig,
    useRelayerRoutes,
    keyPrefix,
  } = useWidgetConfig()
  const setExecutableRoute = useSetExecutableRoute()
  const queryClient = useQueryClient()
  const emitter = useWidgetEvents()
  const swapOnly = useSwapOnly()
  const {
    disabledBridges,
    disabledExchanges,
    enabledBridges,
    enabledExchanges,
    enabledAutoRefuel,
    routePriority,
    slippage,
  } = useSettings([
    'disabledBridges',
    'disabledExchanges',
    'enabledBridges',
    'enabledExchanges',
    'enabledAutoRefuel',
    'routePriority',
    'slippage',
  ])
  const [fromTokenAmount] = useDebouncedWatch(500, 'fromAmount')
  const [
    fromChainId,
    fromTokenAddress,
    toAddress,
    toTokenAmount,
    toChainId,
    toTokenAddress,
    contractCalls,
  ] = useFieldValues(
    'fromChain',
    'fromToken',
    'toAddress',
    'toAmount',
    'toChain',
    'toToken',
    'contractCalls'
  )
  const { token: fromToken } = useToken(fromChainId, fromTokenAddress)
  const { token: toToken } = useToken(toChainId, toTokenAddress)
  const { chain: fromChain } = useChain(fromChainId)
  const { chain: toChain } = useChain(toChainId)
  const { enabled: enabledRefuel, fromAmount: gasRecommendationFromAmount } =
    useGasRefuel()
  const { getChainTypeFromAddress } = useChainTypeFromAddress()

  const { account } = useAccount({ chainType: fromChain?.chainType })
  const { isBatchingSupported, isBatchingSupportedLoading } =
    useIsBatchingSupported(fromChain, account.address)

  const hasAmount = Number(fromTokenAmount) > 0 || Number(toTokenAmount) > 0

  const contractCallQuoteEnabled: boolean =
    subvariant === 'custom' ? Boolean(contractCalls && account.address) : true

  // When we bridge between ecosystems we need to be sure toAddress is set and has the same chainType as toChain
  // If toAddress is set, it must have the same chainType as toChain
  const hasToAddressAndChainTypeSatisfied: boolean =
    !!toChain &&
    !!toAddress &&
    getChainTypeFromAddress(toAddress) === toChain.chainType
  // We need to check for toAddress only if it is set
  const isToAddressSatisfied = toAddress
    ? hasToAddressAndChainTypeSatisfied
    : true

  // toAddress might be an empty string, but we need to pass undefined if there is no value
  const toWalletAddress = toAddress || undefined

  // We need to send the full allowed tools array if custom tool settings are applied
  const allowedBridges =
    bridges?.allow?.length || bridges?.deny?.length ? enabledBridges : undefined
  const allowedExchanges =
    exchanges?.allow?.length || exchanges?.deny?.length
      ? enabledExchanges
      : undefined
  const allowSwitchChain = sdkConfig?.routeOptions?.allowSwitchChain

  const isEnabled =
    Boolean(Number(fromChain?.id)) &&
    Boolean(Number(toChain?.id)) &&
    Boolean(fromToken?.address) &&
    Boolean(toToken?.address) &&
    !Number.isNaN(slippage) &&
    hasAmount &&
    isToAddressSatisfied &&
    contractCallQuoteEnabled &&
    !isBatchingSupportedLoading

  // Some values should be strictly typed and isEnabled ensures that
  const queryKey = useMemo(
    () =>
      [
        getQueryKey('routes', keyPrefix),
        account.address,
        fromChain?.id as number,
        fromToken?.address as string,
        fromTokenAmount,
        toWalletAddress,
        toChain?.id as number,
        toToken?.address as string,
        toTokenAmount,
        contractCalls,
        slippage,
        swapOnly,
        disabledBridges,
        disabledExchanges,
        allowedBridges,
        allowedExchanges,
        routePriority,
        subvariant,
        allowSwitchChain,
        enabledRefuel && enabledAutoRefuel,
        gasRecommendationFromAmount,
        feeConfig?.fee || fee,
        !!isBatchingSupported,
        observableRoute?.id,
      ] as const,
    [
      keyPrefix,
      account.address,
      fromChain?.id,
      fromToken?.address,
      fromTokenAmount,
      toWalletAddress,
      toChain?.id,
      toToken?.address,
      toTokenAmount,
      contractCalls,
      slippage,
      swapOnly,
      disabledBridges,
      disabledExchanges,
      allowedBridges,
      allowedExchanges,
      routePriority,
      subvariant,
      allowSwitchChain,
      enabledRefuel,
      enabledAutoRefuel,
      gasRecommendationFromAmount,
      feeConfig?.fee,
      fee,
      isBatchingSupported,
      observableRoute?.id,
    ]
  )

  const { getIntermediateRoutes, setIntermediateRoutes } =
    useIntermediateRoutesStore()

  const { data, isLoading, isFetching, isFetched, dataUpdatedAt, refetch } =
    useQuery({
      queryKey,
      queryFn: async ({
        queryKey: [
          _,
          fromAddress,
          fromChainId,
          fromTokenAddress,
          fromTokenAmount,
          toAddress,
          toChainId,
          toTokenAddress,
          toTokenAmount,
          contractCalls,
          slippage = defaultSlippage,
          swapOnly,
          disabledBridges,
          disabledExchanges,
          allowedBridges,
          allowedExchanges,
          routePriority,
          subvariant,
          allowSwitchChain,
          enabledRefuel,
          gasRecommendationFromAmount,
          fee,
          isBatchingSupported,
          // _observableRouteId must be the last element in the query key
          _observableRouteId,
        ],
        signal,
      }) => {
        const fromAmount = parseUnits(fromTokenAmount, fromToken!.decimals)
        const toAmount = parseUnits(toTokenAmount, toToken!.decimals)
        const formattedSlippage = slippage
          ? Number.parseFloat(slippage) / 100
          : defaultSlippage

        const allowBridges = swapOnly
          ? []
          : observableRoute
            ? observableRoute.steps.flatMap((step) =>
                step.includedSteps.reduce((toolKeys, includedStep) => {
                  if (includedStep.type === 'cross') {
                    toolKeys.push(includedStep.toolDetails.key)
                  }
                  return toolKeys
                }, [] as string[])
              )
            : allowedBridges
        const allowExchanges = observableRoute
          ? observableRoute.steps.flatMap((step) =>
              step.includedSteps.reduce((toolKeys, includedStep) => {
                if (includedStep.type === 'swap') {
                  toolKeys.push(includedStep.toolDetails.key)
                }
                return toolKeys
              }, [] as string[])
            )
          : allowedExchanges

        const calculatedFee = await feeConfig?.calculateFee?.({
          fromChain: fromChain!,
          toChain: toChain!,
          fromToken: fromToken!,
          toToken: toToken!,
          fromAddress,
          toAddress,
          fromAmount,
          toAmount,
          slippage: formattedSlippage,
        })

        if (subvariant === 'custom' && contractCalls && toAmount) {
          const contractCallQuote = await getContractCallsQuote(
            {
              // Contract calls are enabled only when fromAddress is set
              fromAddress: fromAddress as string,
              fromChain: fromChainId,
              fromToken: fromTokenAddress,
              toAmount: toAmount.toString(),
              toChain: toChainId,
              toToken: toTokenAddress,
              contractCalls,
              denyBridges: disabledBridges.length ? disabledBridges : undefined,
              denyExchanges: disabledExchanges.length
                ? disabledExchanges
                : undefined,
              allowBridges,
              allowExchanges,
              toFallbackAddress: toAddress,
              slippage: formattedSlippage,
              fee: calculatedFee || fee,
            },
            { signal }
          )

          contractCallQuote.action.toToken = toToken!

          const customStep =
            subvariant === 'custom'
              ? contractCallQuote.includedSteps?.find(
                  (step) => step.type === 'custom'
                )
              : undefined

          if (customStep && contractTool) {
            const toolDetails = {
              key: contractTool.name,
              name: contractTool.name,
              logoURI: contractTool.logoURI,
            }
            customStep.toolDetails = toolDetails
            contractCallQuote.toolDetails = toolDetails
          }

          const route: Route = convertQuoteToRoute(contractCallQuote)

          return [route]
        }

        // Prevent sending a request for the same chain token combinations.
        // Exception: proceed anyway if subvariant is custom and subvariantOptions is deposit
        if (
          fromChainId === toChainId &&
          fromTokenAddress === toTokenAddress &&
          !(subvariant === 'custom' && subvariantOptions?.custom === 'deposit')
        ) {
          return
        }

        const isObservableRelayerRoute = observableRoute?.steps?.some((step) =>
          isGaslessStep(step, fromChain)
        )

        const shouldUseMainRoutes =
          !observableRoute || !isObservableRelayerRoute
        const shouldUseRelayerQuote =
          fromAddress &&
          fromChain?.chainType === ChainType.EVM &&
          fromChain.permit2 &&
          fromChain.permit2Proxy &&
          fromChain.relayerSupported &&
          fromChain.nativeToken.address !== fromTokenAddress &&
          useRelayerRoutes &&
          !isBatchingSupported &&
          (!observableRoute || isObservableRelayerRoute)

        const mainRoutesPromise = shouldUseMainRoutes
          ? getRoutes(
              {
                fromAddress,
                fromAmount: fromAmount.toString(),
                fromChainId,
                fromTokenAddress,
                toAddress,
                toChainId,
                toTokenAddress,
                fromAmountForGas:
                  enabledRefuel && gasRecommendationFromAmount
                    ? gasRecommendationFromAmount
                    : undefined,
                options: {
                  allowSwitchChain:
                    subvariant === 'refuel' ? false : allowSwitchChain,
                  bridges:
                    allowBridges?.length || disabledBridges.length
                      ? {
                          allow: allowBridges,
                          deny: disabledBridges.length
                            ? disabledBridges
                            : undefined,
                        }
                      : undefined,
                  exchanges:
                    allowExchanges?.length || disabledExchanges.length
                      ? {
                          allow: allowExchanges,
                          deny: disabledExchanges.length
                            ? disabledExchanges
                            : undefined,
                        }
                      : undefined,
                  order: routePriority,
                  slippage: formattedSlippage,
                  fee: calculatedFee || fee,
                },
              },
              { signal }
            )
          : Promise.resolve(null)

        const relayerQuotePromise = shouldUseRelayerQuote
          ? getRelayerQuote(
              {
                fromAddress,
                fromAmount: fromAmount.toString(),
                fromChain: fromChainId,
                fromToken: fromTokenAddress,
                toAddress,
                toChain: toChainId,
                toToken: toTokenAddress,
                fromAmountForGas:
                  enabledRefuel && gasRecommendationFromAmount
                    ? gasRecommendationFromAmount
                    : undefined,
                order: routePriority,
                slippage: formattedSlippage,
                fee: calculatedFee || fee,
                ...(allowBridges?.length || disabledBridges.length
                  ? {
                      allowBridges: allowBridges,
                      denyBridges: disabledBridges.length
                        ? disabledBridges
                        : undefined,
                    }
                  : undefined),
                ...(allowExchanges?.length || disabledExchanges.length
                  ? {
                      allowExchanges: allowExchanges,
                      denyExchanges: disabledExchanges.length
                        ? disabledExchanges
                        : undefined,
                    }
                  : undefined),
              },
              { signal }
            )
              .then(convertQuoteToRoute)
              .catch(() => null)
          : Promise.resolve(null)

        // Wait for the main routes to complete first
        const routesResult = await mainRoutesPromise

        if (routesResult?.routes[0] && fromAddress) {
          // Update local tokens cache to keep priceUSD in sync
          const { fromToken, toToken } = routesResult.routes[0]
          ;[fromToken, toToken].forEach((token) => {
            queryClient.setQueriesData<TokensResponse>(
              { queryKey: [getQueryKey('tokens', keyPrefix)] },
              (data) => {
                if (data) {
                  const clonedData = { ...data, tokens: { ...data.tokens } }
                  const index = clonedData.tokens?.[token.chainId]?.findIndex(
                    (dataToken) => dataToken.address === token.address
                  )
                  if (index >= 0) {
                    clonedData.tokens[token.chainId] = [
                      ...clonedData.tokens[token.chainId],
                    ]
                    clonedData.tokens[token.chainId][index] = {
                      ...clonedData.tokens[token.chainId][index],
                      ...token,
                    }
                  }
                  return clonedData
                }
              }
            )
            queryClient.setQueriesData<Token[]>(
              {
                queryKey: [
                  getQueryKey('token-balances', keyPrefix),
                  fromAddress,
                  token.chainId,
                ],
              },
              (data) => {
                if (data) {
                  const clonedData = [...data]
                  const index = clonedData.findIndex(
                    (dataToken) => dataToken.address === token.address
                  )
                  if (index >= 0) {
                    clonedData[index] = {
                      ...clonedData[index],
                      ...token,
                    }
                  }
                  return clonedData
                }
              }
            )
          })
        }

        const initialRoutes = routesResult?.routes ?? []

        if (shouldUseRelayerQuote && initialRoutes.length) {
          setIntermediateRoutes(queryKey, initialRoutes)
          emitter.emit(WidgetEvent.AvailableRoutes, initialRoutes)
          // Return early if we're only using main routes
        } else if (shouldUseMainRoutes) {
          // If we don't need relayer quote, return the initial routes
          emitter.emit(WidgetEvent.AvailableRoutes, initialRoutes)
          return initialRoutes
        }

        const relayerRouteResult = await relayerQuotePromise
        // If we have a relayer route, add it to the routes array
        if (relayerRouteResult) {
          // Insert the relayer route at position 1 (after the first route)
          initialRoutes.splice(1, 0, relayerRouteResult)
          // Emit the updated routes
          emitter.emit(WidgetEvent.AvailableRoutes, initialRoutes)
        }

        return initialRoutes
      },
      enabled: isEnabled,
      staleTime: refetchTime,
      refetchInterval(query) {
        return Math.min(
          Math.abs(refetchTime - (Date.now() - query.state.dataUpdatedAt)),
          refetchTime
        )
      },
      retry(failureCount, error: any) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('Route query failed:', { failureCount, error })
        }
        if (failureCount >= 3) {
          return false
        }
        if (error?.code === LiFiErrorCode.NotFound) {
          return false
        }
        return true
      },
    })

  const setReviewableRoute = useCallback(
    (route: Route) => {
      const queryDataKey = queryKey.toSpliced(queryKey.length - 1, 1, route.id)
      queryClient.setQueryData(queryDataKey, [route], {
        updatedAt: dataUpdatedAt || Date.now(),
      })
      setExecutableRoute(route)
    },
    [queryClient, dataUpdatedAt, setExecutableRoute, queryKey]
  )

  return {
    routes: data || getIntermediateRoutes(queryKey),
    isLoading: isEnabled && isLoading,
    isFetching,
    isFetched,
    dataUpdatedAt,
    refetchTime,
    refetch,
    fromChain,
    toChain,
    queryKey,
    setReviewableRoute,
  }
}
