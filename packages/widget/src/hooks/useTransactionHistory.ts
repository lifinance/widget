import type { StatusResponse } from '@lifi/sdk';
import { useLiFi } from '../providers';
import { useQuery } from '@tanstack/react-query';

interface TransactionHistoryResponse {
  transactions: StatusResponse[];
  walletAddress: string;
}

export const useTransactionHistory = (
  address?: string,
): { data: StatusResponse[]; isLoading: boolean; refetch: () => void } => {
  const lifi = useLiFi();

  const cacheKey = 'transaction-history';

  const { data, isLoading, refetch } = useQuery(
    [cacheKey, address],
    async () => {
      if (!address) return [];

      const response = await lifi.getTransactionHistory(address);

      const filteredTransactions = (
        (response as any).transactions as StatusResponse[]
      ).filter(
        (transaction) =>
          !!transaction.receiving.chainId && !!transaction.sending.chainId,
      );

      return filteredTransactions;
    },
  );

  return {
    data: data ?? [],
    isLoading,
    refetch,
  };
};
