import { getTokenBalances } from '@lifi/sdk'
import { useAccount } from '@lifi/wallet-management'
import { useQueries } from '@tanstack/react-query'
import { useMemo } from 'react'
import { formatUnits } from 'viem'
import { mapAndSortTokens } from '../components/TokenList/utils.js'
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js'
import type { FormType } from '../stores/form/types.js'
import type { TokenAmount } from '../types/token.js'
import { getQueryKey } from '../utils/queries.js'
import { useChains } from './useChains.js'
import { useFilteredTokensByBalance } from './useFilteredByTokenBalances.js'
import { useTokens } from './useTokens.js'

const defaultRefetchInterval = 32_000

const sortFn = (a: TokenAmount, b: TokenAmount) =>
  Number.parseFloat(formatUnits(b.amount ?? 0n, b.decimals)) *
    Number.parseFloat(b.priceUSD ?? '0') -
  Number.parseFloat(formatUnits(a.amount ?? 0n, a.decimals)) *
    Number.parseFloat(a.priceUSD ?? '0')

export const useTokenBalances = (
  selectedChainId?: number,
  formType?: FormType,
  isAllNetworks?: boolean
) => {
  const { tokens: allTokens, isLoading } = useTokens(formType)

  const {
    chains,
    isLoading: isSupportedChainsLoading,
    getChainById,
  } = useChains()
  const chain = getChainById(selectedChainId, chains)

  const { account } = useAccount({ chainType: chain?.chainType })

  const chainsPerType = useMemo(() => {
    return chain?.chainType
      ? chains?.filter((c) => c.chainType === chain?.chainType)
      : undefined
  }, [chains, chain?.chainType])

  const tokensPerType = useMemo(() => {
    if (!chainsPerType || !allTokens) {
      return undefined
    }
    const chainIdSet = new Set(chainsPerType.map((c) => c.id))
    const filteredEntries = Object.entries(allTokens).filter(([chainIdStr]) =>
      chainIdSet.has(Number(chainIdStr))
    )
    return Object.fromEntries(filteredEntries)
  }, [allTokens, chainsPerType])

  // Select tokens to fetch balances for
  const filteredByBalance = useFilteredTokensByBalance(
    account.address,
    chain?.chainType,
    tokensPerType
  )

  const isBalanceLoadingEnabled =
    Boolean(account.address) &&
    Boolean(filteredByBalance) &&
    !isSupportedChainsLoading

  const { keyPrefix, tokens: configTokens } = useWidgetConfig()

  const queries = useQueries({
    queries: Object.entries(filteredByBalance ?? {}).map(
      ([chainIdStr, tokens]) => {
        const chainId = Number(chainIdStr)
        return {
          queryKey: [
            getQueryKey('token-balances', keyPrefix),
            account.address,
            chainId,
          ],
          queryFn: async () => {
            if (!account.address || !tokens?.length) {
              return []
            }
            return await getTokenBalances(account.address, tokens)
          },
          enabled: isBalanceLoadingEnabled,
          refetchInterval: defaultRefetchInterval,
          staleTime: defaultRefetchInterval,
        }
      }
    ),
  })

  const allTokensWithBalances = useMemo(() => {
    return queries
      .flatMap((query) => query.data)
      .filter((token) => token !== undefined)
  }, [queries])

  const tokens = useMemo(() => {
    return isAllNetworks
      ? Object.values(allTokens ?? {}).flat()
      : selectedChainId
        ? allTokens?.[selectedChainId]
        : undefined
  }, [allTokens, selectedChainId, isAllNetworks])

  const tokensWithBalances = useMemo(() => {
    const tokensWithAmounts = isAllNetworks
      ? allTokensWithBalances
      : allTokensWithBalances?.filter(
          (token) => token?.chainId === selectedChainId
        )
    tokensWithAmounts.sort(sortFn)
    return tokensWithAmounts
  }, [allTokensWithBalances, selectedChainId, isAllNetworks])

  const { processedTokens, withCategories } = useMemo(() => {
    const tokensWithBalancesSet = new Set(
      tokensWithBalances?.map(
        (token) => `${token.chainId}-${token.address.toLowerCase()}`
      ) ?? []
    )
    const tokensWithoutBalances =
      tokens?.filter((token) => {
        const tokenKey = `${token.chainId}-${token.address.toLowerCase()}`
        return !tokensWithBalancesSet.has(tokenKey) // Only include if NOT in balances
      }) ?? []
    if (isAllNetworks) {
      return {
        processedTokens: [...tokensWithBalances, ...tokensWithoutBalances],
        withCategories: false,
      }
    } else {
      return mapAndSortTokens(
        tokensWithoutBalances,
        tokensWithBalances,
        selectedChainId,
        configTokens
      )
    }
  }, [tokensWithBalances, tokens, isAllNetworks, configTokens, selectedChainId])

  const isBalanceLoading = queries.some((query) => query.isLoading)
  const refetch = () => queries.forEach((query) => query.refetch())

  return {
    tokens: processedTokens,
    withCategories,
    chain,
    isLoading,
    isBalanceLoading: isBalanceLoading && isBalanceLoadingEnabled,
    refetch,
  }
}
