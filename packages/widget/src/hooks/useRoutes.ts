import type { Route, RoutesResponse, Token } from '@lifi/sdk'
import { LiFiErrorCode, getContractCallsQuote, getRoutes } from '@lifi/sdk'
import { useAccount } from '@lifi/wallet-management'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { parseUnits } from 'viem'
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js'
import { useFieldValues } from '../stores/form/useFieldValues.js'
import { useSetExecutableRoute } from '../stores/routes/useSetExecutableRoute.js'
import { useSettings } from '../stores/settings/useSettings.js'
import { defaultSlippage } from '../stores/settings/useSettingsStore.js'
import { WidgetEvent } from '../types/events.js'
import { getChainTypeFromAddress } from '../utils/chainType.js'
import { useChain } from './useChain.js'
import { useDebouncedWatch } from './useDebouncedWatch.js'
import { useGasRefuel } from './useGasRefuel.js'
import { useIsCompatibleDestinationAccount } from './useIsCompatibleDestinationAccount.js'
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
    sdkConfig,
    contractTool,
    bridges,
    exchanges,
    fee,
    feeConfig,
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
  const { isCompatibleDestinationAccount } =
    useIsCompatibleDestinationAccount(observableRoute)
  const { enabled: enabledRefuel, fromAmount: gasRecommendationFromAmount } =
    useGasRefuel()

  const { account } = useAccount({ chainType: fromChain?.chainType })

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
  const allowSwitchChain = isCompatibleDestinationAccount
    ? sdkConfig?.routeOptions?.allowSwitchChain
    : false

  const isEnabled =
    Boolean(Number(fromChainId)) &&
    Boolean(Number(toChainId)) &&
    Boolean(fromToken?.address) &&
    Boolean(toToken?.address) &&
    !Number.isNaN(slippage) &&
    hasAmount &&
    isToAddressSatisfied &&
    contractCallQuoteEnabled

  // Some values should be strictly typed and isEnabled ensures that
  const queryKey = [
    'routes',
    account.address,
    fromChainId as number,
    fromToken?.address as string,
    fromTokenAmount,
    toWalletAddress,
    toChainId as number,
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
    observableRoute?.id,
  ] as const

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
          _observableRouteId,
        ],
        signal,
      }) => {
        const fromAmount = parseUnits(fromTokenAmount, fromToken!.decimals)
        const toAmount = parseUnits(toTokenAmount, toToken!.decimals)
        const formattedSlippage = Number.parseFloat(slippage) / 100

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
          fromChainId,
          toChainId,
          fromTokenAddress,
          toTokenAddress,
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

          const route: Route = {
            id: crypto.randomUUID(),
            fromChainId: contractCallQuote.action.fromChainId,
            fromAmountUSD: contractCallQuote.estimate.fromAmountUSD || '',
            fromAmount: contractCallQuote.action.fromAmount,
            fromToken: contractCallQuote.action.fromToken,
            fromAddress: contractCallQuote.action.fromAddress,
            toChainId: contractCallQuote.action.toChainId,
            toAmountUSD: contractCallQuote.estimate.toAmountUSD || '',
            toAmount: contractCallQuote.estimate.toAmount,
            toAmountMin: contractCallQuote.estimate.toAmountMin,
            toToken: toToken!,
            toAddress:
              contractCallQuote.action.toAddress ||
              contractCallQuote.action.fromAddress,
            gasCostUSD: contractCallQuote.estimate.gasCosts?.[0].amountUSD,
            steps: [contractCallQuote],
            insurance: { state: 'NOT_INSURABLE', feeAmountUsd: '0' },
          }

          return { routes: [route] } as RoutesResponse
        }

        // Prevent sending a request for the same chain token combinations.
        if (fromChainId === toChainId && fromTokenAddress === toTokenAddress) {
          return
        }

        const data = await getRoutes(
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
        if (data.routes[0] && fromAddress) {
          // Update local tokens cache to keep priceUSD in sync
          const { fromToken, toToken } = data.routes[0]
          ;[fromToken, toToken].forEach((token) => {
            queryClient.setQueriesData<Token[]>(
              { queryKey: ['token-balances', fromAddress, token.chainId] },
              (data) => {
                if (data) {
                  const clonedData = [...data]
                  const index = clonedData.findIndex(
                    (dataToken) => dataToken.address === token.address
                  )
                  clonedData[index] = {
                    ...clonedData[index],
                    ...token,
                  }
                  return clonedData
                }
              }
            )
          })
        }
        emitter.emit(WidgetEvent.AvailableRoutes, data.routes)
        return data
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
        if (failureCount >= 5) {
          return false
        }
        if (error?.code === LiFiErrorCode.NotFound) {
          return false
        }
        return true
      },
    })

  const setReviewableRoute = (route: Route) => {
    const queryDataKey = queryKey.toSpliced(queryKey.length - 1, 1, route.id)
    queryClient.setQueryData(
      queryDataKey,
      { routes: [route] },
      { updatedAt: dataUpdatedAt }
    )
    setExecutableRoute(route)
  }

  return {
    routes: data?.routes,
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
