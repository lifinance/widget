import type { TokenExtended } from '@lifi/sdk'
import { useMemo } from 'react'
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js'
import type { FormType } from '../stores/form/types.js'
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

  const isBalanceLoading =
    (isBalanceQueriesLoading || isAccountsLoading) &&
    !allTokensWithBalances?.length

  // Merge tokens from all accounts into a single array
  const displayedTokensList = useMemo(() => {
    const tokensByChain = Object.values(accountsWithAllTokens ?? {}).reduce(
      (acc, accountTokens) => {
        const chains = isAllNetworks
          ? Object.keys(accountTokens)
          : [selectedChainId?.toString()]
        chains.forEach((chainId) => {
          const tokens = accountTokens[Number(chainId)]
          if (tokens) {
            acc[Number(chainId)] = [...(acc[Number(chainId)] || []), ...tokens]
          }
        })
        return acc
      },
      {} as Record<number, TokenExtended[]>
    )
    return Object.values(tokensByChain)
      .flat()
      .filter((t) => isSearchMatch(t, search))
  }, [accountsWithAllTokens, isAllNetworks, selectedChainId, search])

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
    return balancesByChain?.filter((token) => {
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
    isSearchLoading,
    isBalanceLoading,
  }
}
