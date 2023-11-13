import { getGasRecommendation, type ChainId } from '@lifi/sdk';
import { useQuery } from '@tanstack/react-query';
import { useChains } from './useChains';

const refetchInterval = 60_000;

export const useGasRecommendation = (
  chainId: ChainId,
  fromChain?: ChainId,
  fromToken?: string,
) => {
  //TODO: move to using inline getQueryData
  const { chains } = useChains();

  return useQuery({
    queryKey: ['gas-recommendation', chainId, fromChain, fromToken],
    queryFn: async ({ queryKey: [_, chainId, fromChain, fromToken] }) => {
      if (!chains?.some((chain) => chain.id === chainId)) {
        return null;
      }
      const gasRecommendation = await getGasRecommendation({
        chainId: chainId as ChainId,
        fromChain: fromChain as ChainId,
        fromToken: fromToken as string,
      });
      return gasRecommendation;
    },

    enabled: Boolean(chainId),
    refetchInterval,
    staleTime: refetchInterval,
  });
};
