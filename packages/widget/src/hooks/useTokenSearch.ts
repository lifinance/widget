import type { ChainId } from '@lifi/sdk';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useLiFi } from '../providers';
import type { Token } from '../types';

export const useTokenSearch = (
  token: string,
  chainId: number,
  enabled?: boolean,
) => {
  const lifi = useLiFi();
  const queryClient = useQueryClient();
  const { data, isLoading, isFetching, isFetched } = useQuery(
    ['token-search', chainId, token],
    async ({ queryKey: [, chainId, token], signal }) => {
      const data = await lifi.getToken(chainId as ChainId, token as string, {
        signal,
      });
      if (data) {
        queryClient.setQueriesData(['tokens', chainId], (tokens?: Token[]) => {
          if (!tokens?.some((token) => token.address === data.address)) {
            tokens?.push(data as Token);
          }
          return tokens;
        });
      }
      return data as Token;
    },
    {
      enabled,
      retry: false,
    },
  );
  return {
    token: data,
    isLoading,
    isFetching,
    isFetched,
  };
};
