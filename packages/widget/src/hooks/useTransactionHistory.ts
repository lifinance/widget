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
  transactionHashes?: string[],
): TransactionHistoryQueryResponse => {
  const { account } = useAccount();
  const queryClient = useQueryClient();

  const { data, isLoading, refetch } = useQuery({
    queryKey: [
      'transaction-history',
      account.address,
      transactionHashes?.length,
    ],
    queryFn: async () => {
      const validTx = transactionHashes?.find(Boolean);
      if (validTx) {
        const cachedData = queryClient.getQueryData<StatusResponse[]>([
          'transaction-history',
          account.address,
        ]);

        let updatedCachedData = [...(cachedData ?? [])];

        try {
          const response = await getStatus({
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

      if (!account.address) {
        return [];
      }

      const thirtyDaysAgoTimestamp = Date.now() - 2592000000;

      const response = await getTransactionHistory({
        walletAddress: account.address,
        fromTimestamp: thirtyDaysAgoTimestamp / 1000,
        toTimestamp: Date.now() / 1000,
      });

      const filteredTransactions = response.transactions.filter(
        (transaction) =>
          transaction.receiving.chainId && transaction.sending.chainId,
      );

      const sortedTransactions = filteredTransactions.sort((a, b) => {
        return (
          ((b.sending as ExtendedTransactionInfo)?.timestamp ?? 0) -
          ((a.sending as ExtendedTransactionInfo)?.timestamp ?? 0)
        );
      });

      return sortedTransactions;
    },
    refetchInterval: 60000,
    enabled: Boolean(account.address),
  });

  return {
    data: data ?? [],
    isLoading,
    refetch,
  };
};
