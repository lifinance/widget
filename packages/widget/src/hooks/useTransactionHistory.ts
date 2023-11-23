import { getTransactionHistory, type ExtendedTransactionInfo } from '@lifi/sdk';
import { useQuery } from '@tanstack/react-query';
import { useAccount } from './useAccount';

export const useTransactionHistory = () => {
  const { account } = useAccount();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['transaction-history', account.address],
    queryFn: async ({ queryKey: [, accountAddress], signal }) => {
      if (!accountAddress) {
        return [];
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
  });

  return {
    data: data ?? [],
    isLoading,
    refetch,
  };
};
