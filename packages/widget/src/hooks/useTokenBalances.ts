import { useMemo } from 'react'
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js'
import type { FormType } from '../stores/form/types.js'
import { useSettings } from '../stores/settings/useSettings.js'
import type { TokenAmount } from '../types/token.js'
import { formatTokenPrice } from '../utils/format.js'
import { isSearchMatch, processTokenList } from '../utils/tokenList.js'
import { useAccountsBalancesData } from './useAccountsBalancesData.js'
import { useDisplayedTokens } from './useDisplayedTokens.js'
import { useTokenBalancesQueries } from './useTokenBalancesQueries.js'

export const useTokenBalances = (
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
  isBalanceLoading: boolean
} => {
  const { hiddenUI, tokens: configTokens } = useWidgetConfig()
  const {
    allTokens,
    displayedTokensList,
    isPinnedToken,
    isTokensLoading,
    isSearchLoading,
  } = useDisplayedTokens(selectedChainId, formType, isAllNetworks, search)

  const { data: accountsWithAllTokens, isLoading: isAccountsLoading } =
    useAccountsBalancesData(selectedChainId, formType, isAllNetworks, allTokens)

  const isBalanceLoadingEnabled =
    Boolean(accountsWithAllTokens) && !isAccountsLoading

  const { data: allTokensWithBalances, isLoading: isBalanceQueriesLoading } =
    useTokenBalancesQueries(accountsWithAllTokens, isBalanceLoadingEnabled)

  const { smallBalanceThreshold } = useSettings(['smallBalanceThreshold'])

  const isBalanceLoading =
    (isBalanceQueriesLoading || isAccountsLoading) &&
    !allTokensWithBalances?.length

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
      !!smallBalanceThreshold && !hiddenUI?.hideSmallBalances
    const threshold = hideSmallBalances
      ? Number.parseFloat(smallBalanceThreshold)
      : undefined

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
        threshold !== undefined &&
        threshold >= 0 &&
        token.amount
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
    return processTokenList(
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
