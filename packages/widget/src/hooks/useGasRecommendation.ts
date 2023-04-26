import type { ChainId } from '@lifi/sdk';
import { useQuery } from '@tanstack/react-query';
import { useLiFi } from '../providers';

const refetchInterval = 60_000;

export const useGasRecommendation = (
  chainId: ChainId,
  fromChain?: ChainId,
  fromToken?: string,
) => {
  const lifi = useLiFi();

  return useQuery(
    ['gas-recommendation', chainId, fromChain, fromToken],
    async ({ queryKey: [_, chainId, fromChain, fromToken] }) => {
      const gasRecommendation = await lifi.getGasRecommendation({
        chainId: chainId as ChainId,
        fromChain: fromChain as ChainId,
        fromToken: fromToken as string,
      });
      return gasRecommendation;
    },
    {
      enabled: Boolean(chainId),
      refetchInterval,
      staleTime: refetchInterval,
      cacheTime: refetchInterval,
    },
  );
};
