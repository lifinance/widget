import { useMemo } from 'react';
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js';
import type { FormType } from '../stores/form/types.js';
import { isItemAllowed } from '../utils/item.js';
import { useAvailableChains } from './useAvailableChains.js';

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
