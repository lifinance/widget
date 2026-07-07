import type { TokenExtended } from '@lifi/sdk'
import { useMemo } from 'react'
import type { FormType } from '../stores/form/types.js'
import { usePinnedTokensStore } from '../stores/pinnedTokens/PinnedTokensStore.js'
import { isSearchMatch } from '../utils/tokenList.js'
import { useTokens } from './useTokens.js'

export type IsPinnedToken = (chainId: number, tokenAddress: string) => boolean

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
  isTokensLoading: boolean
  isSearchLoading: boolean
} => {
  const {
    allTokens,
    isLoading: isTokensLoading,
    isSearchLoading,
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

  const displayedTokensList = useMemo(() => {
    const tokensByChain = isAllNetworks
      ? Object.values(allTokens ?? {}).flat()
      : selectedChainId
        ? allTokens?.[selectedChainId]
        : undefined
    return tokensByChain?.filter((t) => isSearchMatch(t, search)) ?? []
  }, [allTokens, isAllNetworks, selectedChainId, search])

  return {
    allTokens,
    displayedTokensList,
    isPinnedToken,
    isTokensLoading,
    isSearchLoading,
  }
}
