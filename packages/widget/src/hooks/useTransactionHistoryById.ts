import { StatusResponse, TokensResponse } from '@lifi/sdk';
import { QueryCache, useQuery, useQueryClient } from '@tanstack/react-query';
import { transactionHistoryCacheKey } from './useTransactionHistory';

export const useTransactionHistoryById = (
  transactionId?: string,
): StatusResponse[] => {
  const queryClient = useQueryClient();
  const queryCache = new QueryCache({
    onError: (error) => {
      console.log(error);
    },
    onSuccess: (data) => {
      console.log(data);
    },
    onSettled: (data, error) => {
      console.log(data, error);
    },
  });

  const query = queryCache.find([
    transactionHistoryCacheKey,
    '0x552008c0f6870c2f77e5cc1d2eb9bdff03e30ea0',
  ]);

  console.log({ query });
  //   const { data, isLoading } = useQuery(
  //     [transactionHistoryCacheKey, transactionId],
  //     async ({ queryKey: [, transactionId] }) => {
  //       if (token) {
  //         queryClient.setQueriesData<TokensResponse>(['transactions'], (data) => {
  //           if (
  //             data &&
  //             !data.tokens[chainId as number]?.some(
  //               (t) => t.address === token.address,
  //             )
  //           ) {
  //             const clonedData = { ...data };
  //             clonedData.tokens[chainId as number]?.push(token as TokenAmount);
  //             return clonedData;
  //           }
  //         });
  //       }
  //       return token as TokenAmount;
  //     },
  //     {
  //       enabled: Boolean(chainId && tokenQuery && enabled),
  //       retry: false,
  //     },
  //   );

  return (
    queryClient.getQueryData<StatusResponse[]>([
      transactionHistoryCacheKey,
      '0x552008c0f6870c2f77e5cc1d2eb9bdff03e30ea0',
    ]) ?? []
  );
  //   return {
  //     token: data,
  //     isLoading,
  //   };
};
