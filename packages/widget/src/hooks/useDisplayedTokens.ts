import type { TokenExtended } from '@lifi/sdk'
import { useMemo } from 'react'
import type { FormType } from '../stores/form/types.js'
import { usePinnedTokensStore } from '../stores/pinnedTokens/PinnedTokensStore.js'
import { createSearchMatcher } from '../utils/tokenList.js'
import { useTokens } from './useTokens.js'

export type IsPinnedToken = (chainId: number, tokenAddress: string) => boolean

export type MatchesSearch = ReturnType<typeof createSearchMatcher>

// Balance-free core shared by useTokenList and useTokenBalances.
export const useDisplayedTokens = (
  selectedChainId?: number,
  formType?: FormType,
  isAllNetworks?: boolean,
  search?: string
): {
  allTokens: Record<number, TokenExtended[]> | undefined
  displayedTokensList: TokenExtended[]
  isPinnedToken: IsPinnedToken | undefined
  /**
   * The filter this search applies, built once here so every list that shows
   * the same search — with balances or without — cannot disagree with it.
   */
  matchesSearch: MatchesSearch
  isTokensLoading: boolean
  isSearchLoading: boolean
} => {
  const {
    allTokens,
    isLoading: isTokensLoading,
    isSearchLoading,
    isAddressSearch,
  } = useTokens(formType, search, isAllNetworks ? undefined : selectedChainId)

  const pinnedTokens = usePinnedTokensStore((state) => state.pinnedTokens)

  const isPinnedToken = useMemo<IsPinnedToken | undefined>(() => {
    if (isAllNetworks) {
      const pinnedSet = new Set<string>()
      Object.entries(pinnedTokens).forEach(([chainIdStr, addresses]) => {
        const chainId = Number.parseInt(chainIdStr, 10)
        addresses.forEach((address) => {
          pinnedSet.add(`${chainId}-${address.toLowerCase()}`)
        })
      })
      return (chainId, tokenAddress) =>
        pinnedSet.has(`${chainId}-${tokenAddress.toLowerCase()}`)
    }
    if (selectedChainId) {
      const chainPinnedTokens = pinnedTokens[selectedChainId] || []
      const pinnedSet = new Set(
        chainPinnedTokens.map((addr) => addr.toLowerCase())
      )
      return (chainId, tokenAddress) =>
        chainId === selectedChainId && pinnedSet.has(tokenAddress.toLowerCase())
    }
    return undefined
  }, [isAllNetworks, selectedChainId, pinnedTokens])

  const matchesSearch = useMemo<MatchesSearch>(
    () => createSearchMatcher(search, isAddressSearch),
    [search, isAddressSearch]
  )

  const displayedTokensList = useMemo(() => {
    const tokensByChain = isAllNetworks
      ? Object.values(allTokens ?? {}).flat()
      : selectedChainId
        ? allTokens?.[selectedChainId]
        : undefined
    return tokensByChain?.filter(matchesSearch) ?? []
  }, [allTokens, isAllNetworks, selectedChainId, matchesSearch])

  return {
    allTokens,
    displayedTokensList,
    isPinnedToken,
    matchesSearch,
    isTokensLoading,
    isSearchLoading,
  }
}
