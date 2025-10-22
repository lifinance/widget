import type { EVMChain, RouteExtended, Token, TokenAmount } from '@lifi/sdk'
import { ChainType } from '@lifi/sdk'
import { useAccount } from '@lifi/wallet-management'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useSDKClient } from '../providers/SDKClientProvider.js'
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js'
import { HiddenUI } from '../types/widget.js'
import { getQueryKey } from '../utils/queries.js'
import { useAvailableChains } from './useAvailableChains.js'
import { useIsContractAddress } from './useIsContractAddress.js'
import { getTokenBalancesWithRetry } from './useTokenBalance.js'

export interface GasSufficiency {
  gasAmount: bigint
  tokenAmount?: bigint
  insufficientAmount?: bigint
  insufficient?: boolean
  token: Token
  chain?: EVMChain
}

const refetchInterval = 30_000

export const useGasSufficiency = (route?: RouteExtended) => {
  const { getChainById } = useAvailableChains()
  const { account: EVMAccount, accounts } = useAccount({
    chainType: ChainType.EVM,
  })
  const { keyPrefix, hiddenUI } = useWidgetConfig()
  const sdkClient = useSDKClient()

  const { relevantAccounts, relevantAccountsQueryKey } = useMemo(() => {
    const chainTypes = route?.steps.reduce((acc, step) => {
      const chainType = getChainById(step.action.fromChainId)?.chainType
      if (chainType) {
        acc.add(chainType)
      }
      return acc
    }, new Set<ChainType>())

    const relevantAccounts = accounts.filter(
      (account) =>
        account.isConnected &&
        account.address &&
        chainTypes?.has(account.chainType)
    )
    return {
      relevantAccounts,
      relevantAccountsQueryKey: relevantAccounts
        .map((account) => account.address)
        .join(','),
    }
  }, [accounts, route?.steps, getChainById])

  const { isContractAddress, isLoading: isContractAddressLoading } =
    useIsContractAddress(
      EVMAccount.address,
      route?.fromChainId,
      EVMAccount.chainType
    )

  const { data: insufficientGas, isLoading } = useQuery<GasSufficiency[]>({
    queryKey: [
      getQueryKey('gas-sufficiency-check', keyPrefix),
      relevantAccountsQueryKey,
      route?.id,
      isContractAddress,
    ] as const,
    queryFn: async () => {
      if (!route) {
        return []
      }

      // Filter out steps that are relayer steps or have primaryType 'Permit' or 'Order'
      const filteredSteps = route.steps.filter(
        (step) =>
          !step.typedData?.some(
            (t) => t.primaryType === 'Permit' || t.primaryType === 'Order'
          )
      )

      // If all steps are filtered out, we don't need to check for gas sufficiency
      if (!filteredSteps.length) {
        return []
      }

      // We assume that LI.Fuel protocol always refuels the destination chain
      const hasRefuelStep = route.steps
        .flatMap((step) => step.includedSteps)
        .some((includedStep) => includedStep.tool === 'gasZip')

      const gasCosts = filteredSteps
        .filter((step) => !step.execution || step.execution.status !== 'DONE')
        .reduce(
          (groupedGasCosts, step) => {
            // We need to avoid destination chain step sufficiency check if we have LI.Fuel protocol sub-step
            const skipDueToRefuel =
              step.action.fromChainId === route.toChainId && hasRefuelStep
            if (step.estimate.gasCosts && !skipDueToRefuel) {
              const { token } = step.estimate.gasCosts[0]
              const gasCostAmount = step.estimate.gasCosts.reduce(
                (amount, gasCost) =>
                  amount + BigInt(Number(gasCost.amount).toFixed(0)),
                0n
              )
              groupedGasCosts[token.chainId] = {
                gasAmount: groupedGasCosts[token.chainId]
                  ? groupedGasCosts[token.chainId].gasAmount + gasCostAmount
                  : gasCostAmount,
                token,
                chain: getChainById(token.chainId),
              }
            }
            // Add fees paid in native tokens to gas sufficiency check (included: false)
            const nonIncludedFeeCosts = step.estimate.feeCosts?.filter(
              (feeCost) => !feeCost.included
            )
            if (nonIncludedFeeCosts?.length) {
              const { token } = nonIncludedFeeCosts[0]
              const feeCostAmount = nonIncludedFeeCosts.reduce(
                (amount, feeCost) =>
                  amount + BigInt(Number(feeCost.amount).toFixed(0)),
                0n
              )
              groupedGasCosts[token.chainId] = {
                gasAmount: groupedGasCosts[token.chainId]
                  ? groupedGasCosts[token.chainId].gasAmount + feeCostAmount
                  : feeCostAmount,
                token,
                chain: getChainById(token.chainId),
              }
            }
            return groupedGasCosts
          },
          {} as Record<string, GasSufficiency>
        )

      // Check whether we are sending a native token
      // For native tokens we want to check for the total amount, including the network fee
      if (
        route.fromToken.address === gasCosts[route.fromChainId]?.token.address
      ) {
        gasCosts[route.fromChainId].tokenAmount =
          gasCosts[route.fromChainId]?.gasAmount + BigInt(route.fromAmount)
      }

      const gasCostsValues = Object.values(gasCosts)

      const balanceChecks = await Promise.allSettled(
        relevantAccounts.map((account) => {
          const relevantTokens = gasCostsValues
            .filter((gasCost) => gasCost.chain?.chainType === account.chainType)
            .map((item) => item.token)

          return getTokenBalancesWithRetry(
            sdkClient,
            account.address!,
            relevantTokens
          )
        })
      )

      const tokenBalances = balanceChecks
        .filter(
          (result): result is PromiseFulfilledResult<TokenAmount[]> =>
            result.status === 'fulfilled' && Boolean(result.value)
        )
        .flatMap((result) => result.value)

      if (!tokenBalances?.length) {
        return []
      }

      Object.keys(gasCosts).forEach((chainId) => {
        if (gasCosts[chainId]) {
          const gasTokenBalance =
            tokenBalances?.find(
              (t) =>
                t.chainId === gasCosts[chainId].token.chainId &&
                t.address === gasCosts[chainId].token.address
            )?.amount ?? 0n
          const insufficient =
            gasTokenBalance <= 0n ||
            gasTokenBalance < gasCosts[chainId].gasAmount ||
            gasTokenBalance < (gasCosts[chainId].tokenAmount ?? 0n)

          const insufficientAmount = insufficient
            ? gasCosts[chainId].tokenAmount
              ? gasCosts[chainId].tokenAmount! - gasTokenBalance
              : gasCosts[chainId].gasAmount - gasTokenBalance
            : undefined

          gasCosts[chainId] = {
            ...gasCosts[chainId],
            insufficient,
            insufficientAmount,
            chain: insufficient ? getChainById(Number(chainId)) : undefined,
          }
        }
      })

      const gasCostResult = Object.values(gasCosts).filter(
        (gasCost) => gasCost.insufficient
      )

      return gasCostResult
    },

    enabled: Boolean(
      !isContractAddress &&
        !isContractAddressLoading &&
        relevantAccounts.length > 0 &&
        route &&
        !hiddenUI?.includes(HiddenUI.InsufficientGasMessage)
    ),
    refetchInterval,
    staleTime: refetchInterval,
  })

  return {
    insufficientGas,
    isLoading,
  }
}
