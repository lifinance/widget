import type { FullStatusData } from '@lifi/sdk';
import { getStatus, type StatusResponse } from '@lifi/sdk';
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useAccount } from './useAccount.js';

export const useTransactionDetails = (transactionHash: string) => {
  const { account, accounts } = useAccount();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['transaction-history', transactionHash],
    queryFn: async ({ queryKey: [, transactionHash], signal }) => {
      if (transactionHash) {
        for (const account of accounts) {
          const cachedHistory = queryClient.getQueryData<StatusResponse[]>([
            'transaction-history',
            account.address,
          ]);

          const transaction = cachedHistory?.find(
            (t) => t.sending.txHash === transactionHash,
          );

          if (transaction) {
            return transaction;
          }
        }

        const transaction = await getStatus(
          {
            txHash: transactionHash,
          },
          { signal },
        );

        const fromAddress = (transaction as FullStatusData)?.fromAddress;

        if (fromAddress) {
          queryClient.setQueryData<StatusResponse[]>(
            ['transaction-history', fromAddress],
            (data) => {
              return [...data!, transaction!];
            },
          );
        }

        return transaction;
      }
    },
    refetchInterval: 300000,
    enabled: Boolean(account.isConnected),
    initialData: () => {
      for (const account of accounts) {
        const transaction = queryClient
          .getQueryData<
            StatusResponse[]
          >(['transaction-history', account.address])
          ?.find((t) => t.sending.txHash === transactionHash);
        if (transaction) {
          return transaction;
        }
      }
    },
    placeholderData: keepPreviousData,
  });

  return {
    transaction: data,
    isLoading,
  };
};
