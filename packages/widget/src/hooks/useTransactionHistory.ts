import type { FullStatusData, StatusResponse } from '@lifi/sdk'
import { getTransactionHistory } from '@lifi/sdk'
import { useAccount } from '@lifi/wallet-management'
import type { QueryFunction } from '@tanstack/react-query'
import { useQueries } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useSDKClient } from '../providers/SDKClientProvider.js'
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js'
import type { RouteExecution } from '../stores/routes/types.js'
import { buildRouteFromTxHistory } from '../utils/converters.js'
import { getQueryKey } from '../utils/queries.js'
import { useTools } from './useTools.js'

export const useTransactionHistory = () => {
  const { accounts } = useAccount()
  const { keyPrefix } = useWidgetConfig()
  const sdkClient = useSDKClient()
  const { tools } = useTools()

  const { data: transactions, isLoading } = useQueries({
    queries: accounts.map((account) => ({
      queryKey: [
        getQueryKey('transaction-history', keyPrefix),
        account.address,
      ],
      queryFn: (async ({ queryKey: [, accountAddress], signal }) => {
        if (!accountAddress) {
          return []
        }
        const date = new Date()
        date.setFullYear(date.getFullYear() - 10)

        const response = await getTransactionHistory(
          sdkClient,
          {
            wallet: accountAddress,
            fromTimestamp: Math.floor(date.getTime() / 1000),
            toTimestamp: Math.floor(Date.now() / 1000),
          },
          { signal }
        )

        return response.transfers
      }) as QueryFunction<StatusResponse[], (string | undefined)[], never>,
      refetchInterval: 300_000,
      enabled: Boolean(account.address),
    })),
    combine: (results) => {
      const uniqueTransactions = new Map<string, StatusResponse>()
      results.forEach((result) => {
        if (result.data) {
          result.data.forEach((transaction) => {
            if (
              (transaction as FullStatusData)?.transactionId &&
              (transaction as FullStatusData)?.receiving?.chainId &&
              transaction?.sending.chainId
            ) {
              uniqueTransactions.set(
                (transaction as FullStatusData).transactionId,
                transaction
              )
            }
          })
        }
      })
      return {
        data: Array.from(uniqueTransactions.values()) as StatusResponse[],
        isLoading: results.some((result) => result.isLoading),
      }
    },
  })

  const routeExecutions = useMemo<RouteExecution[]>(
    () =>
      (transactions ?? []).flatMap((transaction) => {
        const routeExecution = buildRouteFromTxHistory(
          transaction as FullStatusData,
          tools
        )
        return routeExecution ? [routeExecution] : []
      }),
    [tools, transactions]
  )

  return {
    data: routeExecutions,
    isLoading,
  }
}
