import type { StatusResponse } from '@lifi/sdk';
import { useLiFi, useWallet } from '../providers';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const transactionHistoryCacheKey = 'transaction-history';

interface TransactionHistoryQueryParams {
  data: StatusResponse[];
  isLoading: boolean;
  refetch: () => void;
}

export const useTransactionHistory = (): TransactionHistoryQueryParams => {
  const { account } = useWallet();
  const lifi = useLiFi();
  const queryClient = useQueryClient();

  const { data, isLoading, refetch } = useQuery(
    [transactionHistoryCacheKey, account.address],
    async () => {
      const cachedData = queryClient.getQueryData<StatusResponse[]>([
        transactionHistoryCacheKey,
        account.address,
      ]);

      if (cachedData) {
        return cachedData as StatusResponse[];
      }

      const response = await lifi.getTransactionHistory(account.address ?? '');

      const filteredTransactions = response.transactions.filter(
        (transaction) =>
          !!transaction.receiving.chainId && !!transaction.sending.chainId,
      );

      return filteredTransactions;
    },
    {
      refetchInterval: 60000,
      staleTime: 60000,
      enabled: Boolean(account.address),
    },
  );

  return {
    data: data ?? [],
    isLoading,
    refetch,
  };
};
