import { getTokenBalances, type TokenExtended } from '@lifi/sdk'
import { keepPreviousData, useQueries } from '@tanstack/react-query'
import { useMemo, useRef } from 'react'
import { useSDKClient } from '../providers/SDKClientProvider.js'
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js'
import type { TokenAmount, TokenAmountExtended } from '../types/token.js'
import { getQueryKey } from '../utils/queries.js'

const defaultRefetchInterval = 32_000
// Max time to hold the skeleton before revealing balances in the multi-chain view.
// Sits just below the typical full-settle time so the list reveals once, sorted,
// instead of reordering as each chain streams in.
const balanceRevealTimeout = 2_000

export const useTokenBalancesQueries = (
  accountsWithTokens?: Record<string, Record<number, TokenExtended[]>>,
  isBalanceLoadingEnabled?: boolean
): {
  data: TokenAmount[] | undefined
  isLoading: boolean
  isError: boolean
} => {
  const { keyPrefix } = useWidgetConfig()
  const sdkClient = useSDKClient()
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
              return await getTokenBalances(sdkClient, accountAddress, tokens)
            },
            enabled: isBalanceLoadingEnabled,
            refetchInterval: defaultRefetchInterval,
            staleTime: defaultRefetchInterval,
            placeholderData: keepPreviousData,
            // Resolve a failed chain immediately instead of retrying past the reveal
            // window (retries would pop the chain in late and re-sort the list).
            retry: false,
          }
        })
    )
  }, [accountsWithTokens, isBalanceLoadingEnabled, keyPrefix, sdkClient])

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

      // Return results once all queries complete, or once the reveal timeout elapses
      const shouldReturnResults =
        allComplete || timeSinceStart >= balanceRevealTimeout

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
