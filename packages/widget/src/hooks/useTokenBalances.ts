import { useMemo } from 'react'
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js'
import type { FormType } from '../stores/form/types.js'
import { useSettings } from '../stores/settings/useSettings.js'
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
  const { hideSmallBalances, smallBalanceThreshold } = useSettings([
    'hideSmallBalances',
    'smallBalanceThreshold',
  ])

  const isBalanceLoading =
    (isBalanceQueriesLoading || isAccountsLoading) &&
    !allTokensWithBalances?.length

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
    let filteredBalances = balancesByChain?.filter((token) => {
      const tokenKey = `${token.chainId}-${token.address.toLowerCase()}`
      // Check if token is in displayed list and has amount
      const isInDisplayedList = displayedTokensSet.has(tokenKey) && token.amount
      // Check if it matches search (for cached appended tokens)
      const matchesSearch = isSearchMatch(token, search)
      return isInDisplayedList || matchesSearch
    })

    // Treat small balances as 0 if hideSmallBalances is enabled
    if (hideSmallBalances && smallBalanceThreshold && filteredBalances) {
      const threshold = Number.parseFloat(smallBalanceThreshold)
      if (!Number.isNaN(threshold) && threshold >= 0) {
        filteredBalances = filteredBalances.map((token) => {
          // Only treat tokens with non-zero balances as 0 if below threshold
          if (!token.amount || token.amount === 0n) {
            return token
          }
          const balanceUSD = formatTokenPrice(
            token.amount,
            token.priceUSD,
            token.decimals
          )
          if (balanceUSD < threshold) {
            return {
              ...token,
              amount: 0n,
            }
          }
          return token
        })
      }
    }

    return filteredBalances
  }, [
    allTokensWithBalances,
    displayedTokensList,
    search,
    selectedChainId,
    isAllNetworks,
    hideSmallBalances,
    smallBalanceThreshold,
  ])

  const { processedTokens, withCategories } = useMemo(() => {
    return processTokenBalances(
      isBalanceLoading,
      isAllNetworks || !!search,
      configTokens,
      selectedChainId,
      displayedTokensList,
      displayedTokensWithBalances
    )
  }, [
    isBalanceLoading,
    isAllNetworks,
    configTokens,
    selectedChainId,
    displayedTokensList,
    displayedTokensWithBalances,
    search,
  ])

  return {
    tokens: processedTokens ?? [],
    withCategories,
    isTokensLoading,
    isSearchLoading,
    isBalanceLoading,
  }
}
