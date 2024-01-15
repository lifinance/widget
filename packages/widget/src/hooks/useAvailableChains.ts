import type { ExtendedChain } from '@lifi/sdk';
import { ChainType, config, getChains } from '@lifi/sdk';
import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useHasExternalWalletProvider, useWidgetConfig } from '../providers';
import { isItemAllowed, defaultChainIdsByType } from '../utils';

export const useAvailableChains = () => {
  const { chains } = useWidgetConfig();
  const { providers } = useHasExternalWalletProvider();
  const { data, isLoading } = useQuery({
    queryKey: ['chains', providers, chains?.types] as const,
    queryFn: async ({ queryKey: [, providers, chainTypes] }) => {
      const availableChains = await getChains({
        chainTypes: (providers.length > 0
          ? providers
          : Object.values(ChainType)
        ).filter((chainType) => isItemAllowed(chainType, chainTypes)),
      });
      config.setChains(availableChains);
      return availableChains;
    },
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
