import type { StatusResponse } from '@lifi/sdk';
import { useLiFi, useWallet } from '../providers';
import { useQuery } from '@tanstack/react-query';

interface TransactionHistoryQueryResponse {
  data: StatusResponse[];
  isLoading: boolean;
  refetch: () => void;
}

export const useTransactionHistory = (): TransactionHistoryQueryResponse => {
  const { account } = useWallet();
  const lifi = useLiFi();
  const { data, isLoading, refetch } = useQuery(
    ['transaction-history', account.address],
    async () => {
      const response = await lifi.getTransactionHistory(account.address ?? '');

      const filteredTransactions = response.transactions.filter(
        (transaction) =>
          !!transaction.receiving.chainId && !!transaction.sending.chainId,
      );

      return filteredTransactions;
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
