import type { FullStatusData } from '@lifi/sdk'
import { type StatusResponse, getStatus } from '@lifi/sdk'
import { useAccount } from '@lifi/wallet-management'
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { lifiWidgetQueryPrefix } from '../config/constants'

const transactionHistoryQueryKey = `${lifiWidgetQueryPrefix}-transaction-history`

export const useTransactionDetails = (transactionHash?: string) => {
  const { account, accounts } = useAccount()
  const queryClient = useQueryClient()

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
