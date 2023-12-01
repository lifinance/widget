import { useQuery } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { isItemAllowed, useLiFi, useWidgetConfig } from '../providers';

export const useChains = () => {
  const { chains } = useWidgetConfig();
  const lifi = useLiFi();
  const { data: availableChains, isLoading: isLoadingAvailableChains } =
    useQuery(['chains'], async () => lifi.getChains(), {
      refetchInterval: 300000,
      staleTime: 300000,
    });

  const filteredChains = useMemo(() => {
    const filteredChains = availableChains?.filter((chain) =>
      isItemAllowed(chain.id, chains),
    );
    return filteredChains;
  }, [availableChains, chains]);

  const getChainById = useCallback(
    (chainId: number) => {
      const chain = availableChains?.find((chain) => chain.id === chainId);
      // if (!chain) {
      //   throw new Error('Chain not found or chainId is invalid.');
      // }
      return chain;
    },
    [availableChains],
  );

  return {
    chains: filteredChains,
    getChainById,
    isLoading: isLoadingAvailableChains,
  };
};
