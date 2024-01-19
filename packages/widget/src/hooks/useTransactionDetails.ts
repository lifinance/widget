import { getStatus, type StatusResponse } from '@lifi/sdk';
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useAccount } from './useAccount';

export const useTransactionDetails = (transactionHash: string) => {
  const { account } = useAccount();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['transaction-history', account.address, transactionHash],
    queryFn: async ({
      queryKey: [, accountAddress, transactionHash],
      signal,
    }) => {
      if (!accountAddress) {
        return;
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
          return transaction;
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

        return transaction;
      }
    },
    refetchInterval: 300000,
    enabled: Boolean(account.address),
    initialData: () => {
      const transaction = queryClient
        .getQueryData<
          StatusResponse[]
        >(['transaction-history', account.address])
        ?.find((t) => t.sending.txHash === transactionHash);

      if (transaction) {
        return transaction;
      }
    },
    placeholderData: keepPreviousData,
  });

  return {
    transaction: data,
    isLoading,
  };
};
