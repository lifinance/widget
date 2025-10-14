import type { FullStatusData } from '@lifi/sdk'
import { getStatus, type StatusResponse } from '@lifi/sdk'
import { useAccount } from '@lifi/wallet-management'
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { useMemo } from 'react'
import { useSDKConfig } from '../providers/SDKConfigProvider/SDKConfigProvider.js'
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js'
import { getQueryKey } from '../utils/queries.js'

export const useTransactionDetails = (transactionHash?: string) => {
  const { account, accounts } = useAccount()
  const queryClient = useQueryClient()
  const { keyPrefix } = useWidgetConfig()
  const sdkConfig = useSDKConfig()

  const transactionHistoryQueryKey = useMemo(
    () => getQueryKey('transaction-history', keyPrefix),
    [keyPrefix]
  )

  const { data, isLoading } = useQuery({
    queryKey: [transactionHistoryQueryKey, transactionHash],
    queryFn: async ({ queryKey: [, transactionHash], signal }) => {
      if (transactionHash) {
        for (const account of accounts) {
          const cachedHistory = queryClient.getQueryData<StatusResponse[]>([
            transactionHistoryQueryKey,
            account.address,
          ])

          const transaction = cachedHistory?.find(
            (t) => t.sending.txHash === transactionHash
          )

          if (transaction) {
            return transaction
          }
        }

        const transaction = await getStatus(
          sdkConfig,
          {
            txHash: transactionHash,
          },
          { signal }
        )

        const fromAddress = (transaction as FullStatusData)?.fromAddress

        if (fromAddress) {
          queryClient.setQueryData<StatusResponse[]>(
            [transactionHistoryQueryKey, fromAddress],
            (data) => {
              return [...data!, transaction!]
            }
          )
        }

        return transaction
      }
    },
    refetchInterval: 300_000,
    enabled: account.isConnected && Boolean(transactionHash),
    initialData: () => {
      for (const account of accounts) {
        const transaction = queryClient
          .getQueryData<StatusResponse[]>([
            transactionHistoryQueryKey,
            account.address,
          ])
          ?.find((t) => t.sending.txHash === transactionHash)
        if (transaction) {
          return transaction
        }
      }
    },
    placeholderData: keepPreviousData,
  })

  return {
    transaction: data,
    isLoading,
  }
}
