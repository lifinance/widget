import type { ExtendedTransactionInfo, StatusResponse } from '@lifi/sdk';
import { useLiFi, useWallet } from '../providers';
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface TransactionHistoryQueryResponse {
  data: StatusResponse[];
  isLoading: boolean;
  refetch: () => void;
}

export const useTransactionHistory = (
  transactionHashes?: string[],
): TransactionHistoryQueryResponse => {
  const { account } = useWallet();
  const lifi = useLiFi();
  const queryClient = useQueryClient();

  const { data, isLoading, refetch } = useQuery(
    ['transaction-history', account.address, transactionHashes?.length],
    async () => {
      const validTx = transactionHashes?.find(Boolean);
      if (validTx) {
        const cachedData = queryClient.getQueryData<StatusResponse[]>([
          'transaction-history',
          account.address,
        ]);

        let updatedCachedData = [...(cachedData ?? [])];

        try {
          const response = await lifi.getStatus({
            txHash: validTx,
          });

          updatedCachedData = [response, ...updatedCachedData];
        } catch (error) {
          console.error(error);
        }

        queryClient.setQueryData<StatusResponse[]>(
          ['transaction-history', account.address],
          (data) => {
            return [...updatedCachedData];
          },
        );

        return updatedCachedData;
      }

      const response = await lifi.getTransactionHistory(account.address ?? '');

      const filteredTransactions = response.transactions.filter(
        (transaction) =>
          !!transaction.receiving.chainId && !!transaction.sending.chainId,
      );

      const sortedTransactions = filteredTransactions.sort((a, b) => {
        return (
          ((b.sending as ExtendedTransactionInfo)?.timestamp ?? 0) -
          ((a.sending as ExtendedTransactionInfo)?.timestamp ?? 0)
        );
      });

      return sortedTransactions;
    },
    {
      refetchInterval: 60000,
      cacheTime: 60000,
      enabled: Boolean(account.address),
    },
  );

  return {
    data: data ?? [],
    isLoading,
    refetch,
  };
};
