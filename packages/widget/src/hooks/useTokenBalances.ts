import { useMemo } from 'react'
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js'
import type { FormType } from '../stores/form/types.js'
import { isSearchMatch, processTokenBalances } from '../utils/tokenList.js'
import { useAccountsDataForBalances } from './useAccountsDataForBalances.js'
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
    displayedTokens,
    isLoading: isTokensLoading,
  } = useTokens(formType, search)

  const { data: accountsWithAllTokens, isLoading: isAccountsLoading } =
    useAccountsDataForBalances(
      selectedChainId,
      formType,
      isAllNetworks,
      allTokens
    )

  const isBalanceLoadingEnabled =
    Boolean(accountsWithAllTokens) && !isAccountsLoading

  const { data: allTokensWithBalances, isLoading: isBalanceQueriesLoading } =
    useTokenBalancesQueries(accountsWithAllTokens, isBalanceLoadingEnabled)

  const { tokens: configTokens } = useWidgetConfig()

  const isBalanceLoading =
    (isBalanceQueriesLoading || isAccountsLoading) &&
    !allTokensWithBalances?.length

  const displayedTokensList = isAllNetworks
    ? Object.values(displayedTokens ?? {}).flat()
    : selectedChainId
      ? displayedTokens?.[selectedChainId]
      : undefined

  const displayedTokensWithBalances = useMemo(() => {
    const balancesByChain = isAllNetworks
      ? allTokensWithBalances
      : selectedChainId
        ? allTokensWithBalances.filter((t) => t.chainId === selectedChainId)
        : []
    const displayedTokensSet = new Set(
      displayedTokensList?.map(
        (t) => `${t.chainId}-${t.address.toLowerCase()}`
      ) || []
    )
    return balancesByChain.filter((token) => {
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

  const { processedTokens, withCategories } = useMemo(() => {
    return processTokenBalances(
      isBalanceLoading,
      isAllNetworks ?? false,
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
  ])

  return {
    tokens: processedTokens ?? [],
    withCategories,
    isTokensLoading,
    isBalanceLoading,
  }
}
