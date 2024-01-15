import { useMemo } from 'react';
import { useWidgetConfig } from '../providers';
import type { FormType } from '../stores';
import { isItemAllowed } from '../utils';
import { useAvailableChains } from './useAvailableChains';

export const useChains = (type?: FormType) => {
  const { chains } = useWidgetConfig();
  const {
    chains: availableChains,
    isLoading: isLoadingAvailableChains,
    getChainById,
  } = useAvailableChains();

  const filteredChains = useMemo(() => {
    const filteredChains = type
      ? availableChains?.filter(
          (chain) =>
            isItemAllowed(chain.id, chains) &&
            isItemAllowed(chain.id, chains?.[type]),
        )
      : availableChains?.filter((chain) => isItemAllowed(chain.id, chains));
    return filteredChains;
  }, [availableChains, chains, type]);

  return {
    chains: filteredChains,
    getChainById,
    isLoading: isLoadingAvailableChains,
  };
};
