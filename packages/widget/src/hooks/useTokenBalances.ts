import { getTokenBalances } from '@lifi/sdk'
import { useAccount } from '@lifi/wallet-management'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js'
import type { FormType } from '../stores/form/types.js'
import type { TokenAmount } from '../types/token.js'
import { getQueryKey } from '../utils/queries.js'
import { useChains } from './useChains.js'
import { useTokens } from './useTokens.js'

const defaultRefetchInterval = 32_000

export const useTokenBalances = (
  selectedChainId?: number,
  formType?: FormType
) => {
  const { tokens: allTokens, isLoading } = useTokens(formType)

  const {
    chains,
    isLoading: isSupportedChainsLoading,
    getChainById,
  } = useChains()
  const chain = getChainById(selectedChainId, chains)

  const { account } = useAccount({ chainType: chain?.chainType })

  const isBalanceLoadingEnabled =
    Boolean(account.address) && Boolean(allTokens) && !isSupportedChainsLoading

  const { keyPrefix } = useWidgetConfig()

  const {
    data: allTokensWithBalances,
    isLoading: isBalanceLoading,
    refetch,
  } = useQuery({
    queryKey: [getQueryKey('token-balances', keyPrefix), account.address],
    queryFn: async ({ queryKey: [, accountAddress] }) => {
      const tokens = Array.from(allTokens?.values() ?? []).flat()

      const tokensWithBalance: TokenAmount[] = await getTokenBalances(
        accountAddress as string,
        tokens!
      )

      if (!tokensWithBalance?.length) {
        return tokens as TokenAmount[]
      }

      return tokensWithBalance
    },
    enabled: isBalanceLoadingEnabled,
    refetchInterval: defaultRefetchInterval,
    staleTime: defaultRefetchInterval,
  })

  const chainTokens = useMemo(() => {
    if (!selectedChainId) {
      return undefined
    }

    const tokensWithBalances = allTokensWithBalances?.filter(
      (token) => token.chainId === selectedChainId
    )

    return tokensWithBalances ?? allTokens?.get(selectedChainId)
  }, [allTokensWithBalances, allTokens, selectedChainId])

  return {
    tokens: chainTokens,
    chain,
    isLoading,
    isBalanceLoading: isBalanceLoading && isBalanceLoadingEnabled,
    refetch,
  }
}
