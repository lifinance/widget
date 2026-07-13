import { useMemo } from 'react'
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js'
import type { FormType } from '../stores/form/types.js'
import type { TokenAmount } from '../types/token.js'
import { processTokenList } from '../utils/tokenList.js'
import { useDisplayedTokens } from './useDisplayedTokens.js'

/**
 * Token-selection list without wallet balances - No accounts are resolved and no balance queries are fired.
 */
export const useTokenList = (
  selectedChainId?: number,
  formType?: FormType,
  isAllNetworks?: boolean,
  search?: string
): {
  tokens: TokenAmount[]
  withCategories: boolean
  withPinnedTokens: boolean
  isTokensLoading: boolean
  isSearchLoading: boolean
} => {
  const { tokens: configTokens } = useWidgetConfig()
  const {
    displayedTokensList,
    isPinnedToken,
    isTokensLoading,
    isSearchLoading,
  } = useDisplayedTokens(selectedChainId, formType, isAllNetworks, search)

  const { processedTokens, withCategories, withPinnedTokens } = useMemo(
    () =>
      processTokenList(
        /* withoutBalances */ true,
        isAllNetworks || !!search,
        configTokens,
        selectedChainId,
        displayedTokensList,
        undefined,
        isPinnedToken
      ),
    [
      isAllNetworks,
      search,
      configTokens,
      selectedChainId,
      displayedTokensList,
      isPinnedToken,
    ]
  )

  return {
    tokens: processedTokens ?? [],
    withCategories,
    withPinnedTokens,
    isTokensLoading,
    isSearchLoading,
  }
}
