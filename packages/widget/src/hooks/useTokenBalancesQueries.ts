import { getTokenBalances, type TokenExtended } from '@lifi/sdk'
import { useQueries } from '@tanstack/react-query'
import { useMemo, useRef } from 'react'
import { useSDKConfig } from '../providers/SDKConfigProvider/SDKConfigProvider.js'
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js'
import type { TokenAmount, TokenAmountExtended } from '../types/token.js'
import { getQueryKey } from '../utils/queries.js'

const defaultRefetchInterval = 32_000

export const useTokenBalancesQueries = (
  accountsWithTokens?: Record<string, Record<number, TokenExtended[]>>,
  isBalanceLoadingEnabled?: boolean
) => {
  const { keyPrefix } = useWidgetConfig()
  const sdkConfig = useSDKConfig()
  const firstLoadStartRef = useRef<number | null>(null)

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
              tokens.length,
            ],
            queryFn: async (): Promise<TokenAmountExtended[]> => {
              if (!accountAddress || !tokens) {
                return []
              }
              return await getTokenBalances(sdkConfig, accountAddress, tokens)
            },
            enabled: isBalanceLoadingEnabled,
            refetchInterval: defaultRefetchInterval,
            staleTime: defaultRefetchInterval,
            keepPreviousData: true,
          }
        })
    )
  }, [accountsWithTokens, isBalanceLoadingEnabled, keyPrefix, sdkConfig])

  const result = useQueries({
    queries: queryConfig,
    combine: (results) => {
      const now = Date.now()

      const hasLoadingQueries = results.some((result) => result.isLoading)
      if (hasLoadingQueries && firstLoadStartRef.current === null) {
        firstLoadStartRef.current = now
      }

      const allComplete = results.every(
        (result) => result.isSuccess || result.isError
      )

      // Reset the start time when all queries complete
      if (allComplete) {
        firstLoadStartRef.current = null
      }

      // Calculate time since first load started
      const timeSinceStart = firstLoadStartRef.current
        ? now - firstLoadStartRef.current
        : 0

      // Return results if all complete OR if 500ms have passed since first query started
      const shouldReturnResults = allComplete || timeSinceStart >= 500

      if (shouldReturnResults) {
        const data: TokenAmount[] = results
          .flatMap((result) => result.data || [])
          .filter((token) => token.amount)
        return {
          data,
          isLoading: !allComplete,
          isError: results.some((result) => result.isError),
        }
      }

      return {
        data: undefined,
        isLoading: true,
        isError: false,
      }
    },
  })

  return result
}
