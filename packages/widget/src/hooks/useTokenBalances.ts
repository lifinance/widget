import { getTokenBalances } from '@lifi/sdk'
import { useAccount } from '@lifi/wallet-management'
import { useQuery } from '@tanstack/react-query'
import { formatUnits } from 'viem'
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js'
import type { FormType } from '../stores/form/types.js'
import type { TokenAmount } from '../types/token.js'
import { getQueryKey } from '../utils/queries.js'
import { useTokens } from './useTokens.js'

const defaultRefetchInterval = 32_000

export const useTokenBalances = (
  selectedChainId?: number,
  formType?: FormType
) => {
  const { tokens, featuredTokens, popularTokens, chain, isLoading } = useTokens(
    selectedChainId,
    formType
  )
  const { account } = useAccount({ chainType: chain?.chainType })
  const { keyPrefix } = useWidgetConfig()

  const isBalanceLoadingEnabled =
    Boolean(account.address) &&
    Boolean(tokens?.length) &&
    Boolean(selectedChainId)

  const {
    data: tokensWithBalance,
    isLoading: isBalanceLoading,
    refetch,
  } = useQuery({
    queryKey: [
      getQueryKey('token-balances', keyPrefix),
      account.address,
      selectedChainId,
      tokens?.length,
      formType,
    ],
    queryFn: async ({ queryKey: [, accountAddress] }) => {
      const tokensWithBalance: TokenAmount[] = await getTokenBalances(
        accountAddress as string,
        tokens!
      )

      if (!tokensWithBalance?.length) {
        return tokens as TokenAmount[]
      }

      const sortFn = (a: TokenAmount, b: TokenAmount) =>
        Number.parseFloat(formatUnits(b.amount ?? 0n, b.decimals)) *
          Number.parseFloat(b.priceUSD ?? '0') -
        Number.parseFloat(formatUnits(a.amount ?? 0n, a.decimals)) *
          Number.parseFloat(a.priceUSD ?? '0')

      const featuredTokens: TokenAmount[] = []
      const tokensWithAmount: TokenAmount[] = []
      const popularTokens: TokenAmount[] = []
      const allTokens: TokenAmount[] = []

      tokensWithBalance.forEach((token) => {
        if (token.amount) {
          token.featured = false
          token.popular = false
        }
        if (token.featured) {
          featuredTokens.push(token)
        } else if (token.amount) {
          tokensWithAmount.push(token)
        } else if (token.popular) {
          popularTokens.push(token)
        } else {
          allTokens.push(token)
        }
      })

      tokensWithAmount.sort(sortFn)

      const result = [
        ...featuredTokens,
        ...tokensWithAmount,
        ...popularTokens,
        ...allTokens,
      ]
      return result
    },
    enabled: isBalanceLoadingEnabled,
    refetchInterval: defaultRefetchInterval,
    staleTime: defaultRefetchInterval,
  })

  return {
    tokens,
    tokensWithBalance,
    featuredTokens,
    popularTokens,
    chain,
    isLoading,
    isBalanceLoading: isBalanceLoading && isBalanceLoadingEnabled,
    refetch,
  }
}
