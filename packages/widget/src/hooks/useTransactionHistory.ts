import {
  getStatus,
  getTransactionHistory,
  type ExtendedTransactionInfo,
  type StatusResponse,
} from '@lifi/sdk';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAccount } from './useAccount';

interface TransactionHistoryQueryResponse {
  data: StatusResponse[];
  isLoading: boolean;
  refetch: () => void;
}

export const useTransactionHistory = (
  transactionHash?: string,
): TransactionHistoryQueryResponse => {
  const { account } = useAccount();
  const queryClient = useQueryClient();

  const { data, isLoading, refetch } = useQuery({
    queryKey: transactionHash
      ? ['transaction-history', account.address, transactionHash]
      : ['transaction-history', account.address],
    queryFn: async ({
      queryKey: [, accountAddress, transactionHash],
      signal,
    }) => {
      if (!accountAddress) {
        return [];
      }
      if (transactionHash) {
        const cachedHistory = queryClient.getQueryData<StatusResponse[]>([
          'transaction-history',
          accountAddress,
        ]);

        let transaction = cachedHistory?.find(
          (t) => t.sending.txHash === transactionHash,
        );

        if (transaction) {
          return [transaction];
        }

        transaction = await getStatus(
          {
            txHash: transactionHash,
          },
          { signal },
        );

        if (cachedHistory && transaction) {
          queryClient.setQueryData<StatusResponse[]>(
            ['transaction-history', accountAddress],
            (data) => {
              return [...data!, transaction!];
            },
          );
        }

        return [transaction];
      }

      const date = new Date();
      date.setFullYear(date.getFullYear() - 10);

      const response = await getTransactionHistory(
        {
          wallet: accountAddress,
          fromTimestamp: date.getTime() / 1000,
          toTimestamp: Date.now() / 1000,
        },
        { signal },
      );

      const filteredTransactions = response.transfers
        .filter(
          (transaction) =>
            transaction.receiving.chainId && transaction.sending.chainId,
        )
        .sort((a, b) => {
          return (
            ((b.sending as ExtendedTransactionInfo)?.timestamp ?? 0) -
            ((a.sending as ExtendedTransactionInfo)?.timestamp ?? 0)
          );
        });

      return filteredTransactions;
    },
    refetchInterval: 300000,
    enabled: Boolean(account.address),
    initialData: () => {
      const cachedHistory = queryClient.getQueryData<StatusResponse[]>([
        'transaction-history',
        account.address,
      ]);

      let transaction = cachedHistory?.find(
        (t) => t.sending.txHash === transactionHash,
      );

      if (transaction) {
        return [transaction];
      }
    },
  });

  return {
    data: data ?? [],
    isLoading,
    refetch,
  };
};
