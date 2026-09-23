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
