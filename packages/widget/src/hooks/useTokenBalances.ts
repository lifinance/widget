import { useMemo } from 'react'
import { processTokenBalances } from '../components/TokenList/utils.js'
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js'
import type { FormType } from '../stores/form/types.js'
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
    return allTokensWithBalances.filter((token) =>
      displayedTokensList?.some(
        (t) =>
          t.chainId === token.chainId &&
          t.address === token.address &&
          token.amount
      )
    )
  }, [allTokensWithBalances, displayedTokensList])

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
