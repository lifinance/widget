import { useQuery } from '@tanstack/react-query';
import { useFormContext } from 'react-hook-form';
import { FormKey, isItemAllowed, useWidgetConfig } from '../providers';
import { useChainOrderStore } from '../stores';
import { useAvailableChains } from './useAvailableChains';

export const useChains = () => {
  const { chains, keyPrefix } = useWidgetConfig();
  const { getValues, setValue } = useFormContext();
  const initializeChains = useChainOrderStore(
    (state) => state.initializeChains,
  );
  const {
    chains: availableChains,
    isLoading: isLoadingAvailableChains,
    getChainById,
  } = useAvailableChains();

  const { data: filteredChains, isLoading: isLoadingFilteredChains } = useQuery(
    {
      queryKey: ['filtered-chains', availableChains?.length, keyPrefix],
      queryFn: async () => {
        if (!availableChains) {
          return;
        }
        const filteredChains = availableChains.filter((chain) =>
          isItemAllowed(chain.id, chains),
        );
        const chainOrder = initializeChains(
          filteredChains.map((chain) => chain.id),
        );
        const [fromChainValue, toChainValue] = getValues([
          FormKey.FromChain,
          FormKey.ToChain,
        ]);
        if (!fromChainValue) {
          setValue(FormKey.FromChain, chainOrder[0]);
        }
        if (!toChainValue) {
          setValue(FormKey.ToChain, chainOrder[0]);
        }
        return filteredChains;
      },

      enabled: Boolean(availableChains),
    },
  );

  return {
    chains: filteredChains,
    getChainById,
    isLoading: isLoadingAvailableChains || isLoadingFilteredChains,
  };
};
