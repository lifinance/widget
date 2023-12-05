import { useMemo } from 'react';
import { isItemAllowed, useWidgetConfig } from '../providers';
import { useAvailableChains } from './useAvailableChains';

export const useChains = () => {
  const { chains } = useWidgetConfig();
  const {
    chains: availableChains,
    isLoading: isLoadingAvailableChains,
    getChainById,
  } = useAvailableChains();

  const filteredChains = useMemo(() => {
    const filteredChains = availableChains?.filter((chain) =>
      isItemAllowed(chain.id, chains),
    );
    return filteredChains;
  }, [availableChains, chains]);

  return {
    chains: filteredChains,
    getChainById,
    isLoading: isLoadingAvailableChains,
  };
};
