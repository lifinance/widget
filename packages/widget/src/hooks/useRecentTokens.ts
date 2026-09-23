import { useMemo } from 'react'
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js'
import type { FormType } from '../stores/form/types.js'
import { useRecentTokensStore } from '../stores/recentTokens/RecentTokensStore.js'
import type { RecentTokenId } from '../stores/recentTokens/types.js'
import type { TokenAmount } from '../types/token.js'
import type { RecentTokensResult } from '../utils/recentTokens.js'
import { resolveRecentRows, spliceRecentRows } from '../utils/recentTokens.js'
import { useChains } from './useChains.js'

export interface UseRecentTokensOptions {
  selectedChainId?: number
  isAllNetworks?: boolean
  search?: string
  expanded: boolean
  formType: FormType
  isTokensLoading: boolean
  nativeHoisted: boolean
}

export interface UseRecentTokensResult extends RecentTokensResult {
  bandEntries: RecentTokenId[]
  recentStartIndex: number
}

export const useRecentTokens = (
  tokens: TokenAmount[],
  {
    selectedChainId,
    isAllNetworks,
    search,
    expanded,
    formType,
    isTokensLoading,
    nativeHoisted,
  }: UseRecentTokensOptions
): UseRecentTokensResult => {
  const { hiddenUI, tokens: configTokens } = useWidgetConfig()
  // useChains, not useAvailableChains: only it applies chains.allow/deny.
  const { chains } = useChains(formType)
  const recentTokens = useRecentTokensStore((state) => state.recentTokens)

  const availableChainIds = useMemo(
    () => new Set(chains?.map((chain) => chain.id)),
    [chains]
  )

  // Wait for the token list (no amber flash) and the chains (allow/deny).
  const disabled =
    !!search || !!hiddenUI?.recentSearches || isTokensLoading || !chains

  const resolved = useMemo(
    () =>
      resolveRecentRows(tokens, {
        recentTokens,
        availableChainIds,
        configTokens,
        formType,
        selectedChainId,
        isAllNetworks,
        nativeHoisted,
        disabled,
      }),
    [
      tokens,
      recentTokens,
      availableChainIds,
      configTokens,
      formType,
      selectedChainId,
      isAllNetworks,
      nativeHoisted,
      disabled,
    ]
  )

  // Separate, so a Show more/less click redoes the slice but not the scan.
  const spliced = useMemo(
    () => spliceRecentRows(tokens, resolved, expanded),
    [tokens, resolved, expanded]
  )

  return {
    ...spliced,
    bandEntries: resolved.bandEntries,
    recentStartIndex: resolved.recentStartIndex,
  }
}
