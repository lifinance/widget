import { useMemo } from 'react'
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js'
import type { FormType } from '../stores/form/types.js'
import { usePinnedTokensStore } from '../stores/pinnedTokens/PinnedTokensStore.js'
import { useSettings } from '../stores/settings/useSettings.js'
import { HiddenUI } from '../types/widget.js'
import { formatTokenPrice } from '../utils/format.js'
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
  const { hiddenUI } = useWidgetConfig()
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
  const { smallBalanceThreshold } = useSettings(['smallBalanceThreshold'])

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

    const hideSmallBalances =
      !!smallBalanceThreshold && !hiddenUI?.includes(HiddenUI.HideSmallBalances)
    const threshold = hideSmallBalances
      ? Number.parseFloat(smallBalanceThreshold)
      : NaN

    if (!balancesByChain) {
      return undefined
    }

    return balancesByChain.reduce<typeof balancesByChain>((acc, token) => {
      const tokenKey = `${token.chainId}-${token.address.toLowerCase()}`
      // Check if token is in displayed list and has amount
      const isInDisplayedList = displayedTokensSet.has(tokenKey) && token.amount
      // Check if it matches search (for cached appended tokens)
      const matchesSearch = isSearchMatch(token, search)

      // Filter: only include tokens that match our criteria
      if (!isInDisplayedList && !matchesSearch) {
        return acc
      }

      // Apply small balance threshold transformation if enabled
      let processedToken = token
      if (
        hideSmallBalances &&
        !Number.isNaN(threshold) &&
        threshold >= 0 &&
        token.amount &&
        token.amount !== 0n
      ) {
        const balanceUSD = formatTokenPrice(
          token.amount,
          token.priceUSD,
          token.decimals
        )
        if (balanceUSD < threshold) {
          processedToken = {
            ...token,
            amount: 0n,
          }
        }
      }

      acc.push(processedToken)
      return acc
    }, [])
  }, [
    allTokensWithBalances,
    displayedTokensList,
    search,
    selectedChainId,
    isAllNetworks,
    smallBalanceThreshold,
    hiddenUI,
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
