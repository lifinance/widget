import type { ExtendedChain } from '@lifi/sdk';
import { ChainType, getChains } from '@lifi/sdk';
import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';

export const useAvailableChains = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['chains'],
    queryFn: async () =>
      getChains({ chainTypes: [ChainType.EVM, ChainType.SVM] }),
    refetchInterval: 300000,
    staleTime: 300000,
  });

  const getChainById = useCallback(
    (chainId?: number, chains: ExtendedChain[] | undefined = data) => {
      if (!chainId) {
        return;
      }
      const chain = chains?.find((chain) => chain.id === chainId);
      // if (!chain) {
      //   throw new Error('Chain not found or chainId is invalid.');
      // }
      return chain;
    },
    [data],
  );

  return {
    chains: data,
    getChainById,
    isLoading,
  };
};
