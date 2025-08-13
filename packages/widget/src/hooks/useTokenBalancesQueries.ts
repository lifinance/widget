import { getTokenBalances } from '@lifi/sdk'
import { useQueries } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js'
import type { TokenAmount } from '../types/token.js'
import { getQueryKey } from '../utils/queries.js'

const defaultRefetchInterval = 32_000

export const useTokenBalancesQueries = (
  accountsWithTokens?: Record<string, Record<number, TokenAmount[]>>,
  isBalanceLoadingEnabled?: boolean
) => {
  const { keyPrefix } = useWidgetConfig()

  const queryConfig = useMemo(() => {
    if (!accountsWithTokens) {
      return []
    }
    return Object.entries(accountsWithTokens).flatMap(
      ([accountAddress, chainTokens]) =>
        Object.entries(chainTokens).map(([chainIdStr, tokens]) => {
          const chainId = Number(chainIdStr)
          return {
            queryKey: [
              getQueryKey('token-balances', keyPrefix),
              accountAddress,
              chainId,
            ],
            queryFn: async (): Promise<TokenAmount[]> => {
              if (!accountAddress || !tokens) {
                return []
              }
              return await getTokenBalances(accountAddress, tokens)
            },
            enabled: isBalanceLoadingEnabled,
            refetchInterval: defaultRefetchInterval,
            staleTime: defaultRefetchInterval,
            keepPreviousData: true,
          }
        })
    )
  }, [accountsWithTokens, isBalanceLoadingEnabled, keyPrefix])

  const result = useQueries({
    queries: queryConfig,
    combine: (results) => {
      // Check if all queries are complete
      const allComplete = results.every(
        (result) => result.isSuccess || result.isError
      )

      if (!allComplete) {
        return {
          data: undefined,
          isLoading: true,
          isError: false,
        }
      }

      // Return all results once everything is done
      const data: TokenAmount[] = results.flatMap((result) => result.data || [])
      return {
        data,
        isLoading: false,
        isError: results.some((result) => result.isError),
      }
    },
  })

  return {
    data: result.data,
    isBalanceLoading: result.isLoading,
  }
}
