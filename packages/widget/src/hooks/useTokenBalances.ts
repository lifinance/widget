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
  isAllNetworks?: boolean
) => {
  const { tokens: allTokens, isLoading: isTokensLoading } = useTokens(formType)

  const { data: accountsWithTokens, isLoading: isAccountsLoading } =
    useAccountsDataForBalances(
      selectedChainId,
      formType,
      isAllNetworks,
      allTokens
    )

  const isBalanceLoadingEnabled =
    Boolean(accountsWithTokens) && !isAccountsLoading

  const { data: allTokensWithBalances, isLoading: isBalanceQueriesLoading } =
    useTokenBalancesQueries(accountsWithTokens, isBalanceLoadingEnabled)

  const { tokens: configTokens } = useWidgetConfig()

  const isBalanceLoading =
    (isBalanceLoadingEnabled || isAccountsLoading) &&
    isBalanceQueriesLoading &&
    !allTokensWithBalances?.length

  const { processedTokens, withCategories } = useMemo(() => {
    return processTokenBalances(
      isBalanceLoading,
      isAllNetworks ?? false,
      configTokens,
      selectedChainId,
      allTokens,
      allTokensWithBalances
    )
  }, [
    isBalanceLoading,
    isAllNetworks,
    configTokens,
    selectedChainId,
    allTokens,
    allTokensWithBalances,
  ])

  return {
    tokens: processedTokens ?? [],
    withCategories,
    isTokensLoading,
    isBalanceLoading,
  }
}
