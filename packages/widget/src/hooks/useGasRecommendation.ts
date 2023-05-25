import type { ChainId } from '@lifi/sdk';
import { useQuery } from '@tanstack/react-query';
import { useLiFi } from '../providers';
import { useChains } from './useChains';

const refetchInterval = 60_000;

export const useGasRecommendation = (
  chainId: ChainId,
  fromChain?: ChainId,
  fromToken?: string,
) => {
  const lifi = useLiFi();
  const { chains } = useChains();

  return useQuery(
    ['gas-recommendation', chainId, fromChain, fromToken],
    async ({ queryKey: [_, chainId, fromChain, fromToken] }) => {
      if (!chains?.some((chain) => chain.id === chainId)) {
        return null;
      }
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
