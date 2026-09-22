import { useMemo } from 'react'
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js'
import type { FormType } from '../stores/form/types.js'
import { useRecentTokensStore } from '../stores/recentTokens/RecentTokensStore.js'
import type { TokenAmount } from '../types/token.js'
import type { RecentTokensResult } from '../utils/recentTokens.js'
import { resolveRecentTokens } from '../utils/recentTokens.js'
import { useChains } from './useChains.js'

export interface UseRecentTokensOptions {
  selectedChainId?: number
  isAllNetworks?: boolean
  search?: string
  expanded: boolean
  formType: FormType
  isTokensLoading: boolean
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
  }: UseRecentTokensOptions
): RecentTokensResult => {
  const { hiddenUI, tokens: configTokens } = useWidgetConfig()
  // useChains applies chains.allow/deny per form type; useAvailableChains
  // filters by chain type only and would let a denied chain through.
  const { chains } = useChains(formType)
  const recentTokens = useRecentTokensStore((state) => state.recentTokens)

  const availableChainIds = useMemo(
    () => new Set(chains?.map((chain) => chain.id)),
    [chains]
  )

  // A snapshot carries no verification verdict, so the band waits for the
  // list rather than flashing an amber warning on every row while it loads.
  // A token the list never returns still renders as unverified.
  // `chains` is query-backed. Until it resolves, an allow/deny config cannot
  // be applied, so the band waits rather than showing a denied chain.
  const disabled =
    !!search || !!hiddenUI?.recentSearches || isTokensLoading || !chains

  return useMemo(
    () =>
      resolveRecentTokens(tokens, {
        recentTokens,
        availableChainIds,
        configTokens,
        formType,
        selectedChainId,
        isAllNetworks,
        search,
        expanded,
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
      search,
      expanded,
      disabled,
    ]
  )
}
