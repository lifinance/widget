import type { ChainId, TokensResponse } from '@lifi/sdk';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useLiFi } from '../providers';
import type { Token } from '../types';

export const useTokenSearch = (
  chainId?: number,
  tokenQuery?: string,
  enabled?: boolean,
) => {
  const lifi = useLiFi();
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery(
    ['token-search', chainId, tokenQuery],
    async ({ queryKey: [, chainId, tokenQuery], signal }) => {
      const token = await lifi.getToken(
        chainId as ChainId,
        tokenQuery as string,
        {
          signal,
        },
      );
      if (token) {
        queryClient.setQueriesData(
          ['tokens'],
          (data?: TokensResponse) => {
            if (
              !data?.tokens[chainId as number].some(
                (t) => t.address === token.address,
              )
            ) {
              data?.tokens[chainId as number].push(token as Token);
            }
            return data;
          },
          { updatedAt: Date.now() },
        );
      }
      return token as Token;
    },
    {
      enabled: Boolean(chainId && tokenQuery && enabled),
      retry: false,
    },
  );
  return {
    token: data,
    isLoading,
  };
};
