import type { StatusResponse } from '@lifi/sdk';
import { getTransactionHistory, type ExtendedTransactionInfo } from '@lifi/sdk';
import type { QueryFunction } from '@tanstack/react-query';
import { useQueries } from '@tanstack/react-query';
import { useAccount } from './useAccount';

export const useTransactionHistory = () => {
  const { accounts } = useAccount();

  const { data, isLoading } = useQueries({
    queries: accounts.map((account) => ({
      queryKey: ['transaction-history', account.address],
      queryFn: (async ({ queryKey: [, accountAddress], signal }) => {
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

        return response.transfers;
      }) as QueryFunction<StatusResponse[], (string | undefined)[], never>,
      refetchInterval: 300000,
      enabled: Boolean(account.address),
    })),
    combine: (results) => {
      const data = results
        .filter((result) => result.data)
        .flatMap((result) => result.data)
        .filter(
          (transaction) =>
            transaction?.receiving.chainId && transaction.sending.chainId,
        )
        .sort((a, b) => {
          return (
            ((b?.sending as ExtendedTransactionInfo)?.timestamp ?? 0) -
            ((a?.sending as ExtendedTransactionInfo)?.timestamp ?? 0)
          );
        }) as StatusResponse[];
      return {
        data: data,
        isLoading: results.some((result) => result.isLoading),
      };
    },
  });

  return {
    data,
    isLoading,
  };
};
