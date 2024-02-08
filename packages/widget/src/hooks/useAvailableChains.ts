import type { ExtendedChain } from '@lifi/sdk';
import { ChainType, config, getChains } from '@lifi/sdk';
import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useHasExternalWalletProvider } from '../providers/WalletProvider/useHasExternalWalletProvider.js';
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js';
import { isItemAllowed } from '../utils/item.js';

const supportedChainTypes = [ChainType.EVM, ChainType.SVM];

export const useAvailableChains = () => {
  const { chains } = useWidgetConfig();
  const { providers } = useHasExternalWalletProvider();
  const { data, isLoading } = useQuery({
    queryKey: ['chains', providers, chains?.types] as const,
    queryFn: async ({ queryKey: [, providers, chainTypes] }) => {
      const chainTypesRequest = (
        providers.length > 0 ? providers : supportedChainTypes
      ).filter((chainType) => isItemAllowed(chainType, chainTypes));

      const availableChains = await getChains({
        chainTypes: chainTypesRequest,
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
