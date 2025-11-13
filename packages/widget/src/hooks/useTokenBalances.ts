import { useMemo } from 'react'
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js'
import type { FormType } from '../stores/form/types.js'
import { usePinnedTokensStore } from '../stores/pinnedTokens/PinnedTokensStore.js'
import { isSearchMatch, processTokenBalances } from '../utils/tokenList.js'
import { useAccountsBalancesData } from './useAccountsBalancesData.js'
import { useTokenBalancesQueries } from './useTokenBalancesQueries.js'
import { useTokens } from './useTokens.js'

export const useTokenBalances = (
  selectedChainId?: number,
  formType?: FormType,
  isAllNetworks?: boolean,
  search?: string
) => {
  const {
    allTokens,
    isLoading: isTokensLoading,
    isSearchLoading,
  } = useTokens(formType, search, isAllNetworks ? undefined : selectedChainId)

  const { data: accountsWithAllTokens, isLoading: isAccountsLoading } =
    useAccountsBalancesData(selectedChainId, formType, isAllNetworks, allTokens)

  const isBalanceLoadingEnabled =
    Boolean(accountsWithAllTokens) && !isAccountsLoading

  const { data: allTokensWithBalances, isLoading: isBalanceQueriesLoading } =
    useTokenBalancesQueries(accountsWithAllTokens, isBalanceLoadingEnabled)

  const { tokens: configTokens } = useWidgetConfig()

  const pinnedTokens = usePinnedTokensStore((state) => state.pinnedTokens)

  const isBalanceLoading =
    (isBalanceQueriesLoading || isAccountsLoading) &&
    !allTokensWithBalances?.length

  // Create function to check if token is pinned
  const isPinnedToken = useMemo(() => {
    if (isAllNetworks) {
      // For all networks, check all pinned tokens
      const allPinned: Array<{ chainId: number; tokenAddress: string }> = []
      Object.entries(pinnedTokens).forEach(([chainIdStr, addresses]) => {
        const chainId = Number.parseInt(chainIdStr, 10)
        addresses.forEach((address) => {
          allPinned.push({ chainId, tokenAddress: address })
        })
      })
      const pinnedSet = new Set(
        allPinned.map((p) => `${p.chainId}-${p.tokenAddress.toLowerCase()}`)
      )
      return (chainId: number, tokenAddress: string) => {
        const key = `${chainId}-${tokenAddress.toLowerCase()}`
        return pinnedSet.has(key)
      }
    } else if (selectedChainId) {
      // For single chain, check only selected chain
      const chainPinnedTokens = pinnedTokens[selectedChainId] || []
      const pinnedSet = new Set(
        chainPinnedTokens.map((addr) => addr.toLowerCase())
      )
      return (chainId: number, tokenAddress: string) => {
        return (
          chainId === selectedChainId &&
          pinnedSet.has(tokenAddress.toLowerCase())
        )
      }
    }
    return undefined
  }, [isAllNetworks, selectedChainId, pinnedTokens])

  const displayedTokensList = useMemo(() => {
    const tokensByChain = isAllNetworks
      ? Object.values(allTokens ?? {}).flat()
      : selectedChainId
        ? allTokens?.[selectedChainId]
        : undefined
    return tokensByChain?.filter((t) => isSearchMatch(t, search)) ?? []
  }, [allTokens, isAllNetworks, selectedChainId, search])

  const displayedTokensWithBalances = useMemo(() => {
    const balancesByChain = isAllNetworks
      ? allTokensWithBalances
      : selectedChainId
        ? allTokensWithBalances?.filter((t) => t.chainId === selectedChainId)
        : undefined
    const displayedTokensSet = new Set(
      displayedTokensList?.map(
        (t) => `${t.chainId}-${t.address.toLowerCase()}`
      ) || []
    )
    return balancesByChain?.filter((token) => {
      const tokenKey = `${token.chainId}-${token.address.toLowerCase()}`
      // Check if token is in displayed list and has amount
      const isInDisplayedList = displayedTokensSet.has(tokenKey) && token.amount
      // Check if it matches search (for cached appended tokens)
      const matchesSearch = isSearchMatch(token, search)
      return isInDisplayedList || matchesSearch
    })
  }, [
    allTokensWithBalances,
    displayedTokensList,
    search,
    selectedChainId,
    isAllNetworks,
  ])

  const { processedTokens, withCategories, withPinnedTokens } = useMemo(() => {
    return processTokenBalances(
      isBalanceLoading,
      isAllNetworks || !!search,
      configTokens,
      selectedChainId,
      displayedTokensList,
      displayedTokensWithBalances,
      isPinnedToken
    )
  }, [
    isBalanceLoading,
    isAllNetworks,
    configTokens,
    selectedChainId,
    displayedTokensList,
    displayedTokensWithBalances,
    search,
    isPinnedToken,
  ])

  return {
    tokens: processedTokens ?? [],
    withCategories,
    withPinnedTokens,
    isTokensLoading,
    isSearchLoading,
    isBalanceLoading,
  }
}
