import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormKey, isItemAllowed, useLiFi, useWidgetConfig } from '../providers';
import { useChainOrderStore } from '../stores';

export const useChains = () => {
  const { chains, keyPrefix } = useWidgetConfig();
  const lifi = useLiFi();
  const { getValues, setValue } = useFormContext();
  const initializeChains = useChainOrderStore(
    (state) => state.initializeChains,
  );

  const { data: availableChains, isLoading: isLoadingAvailableChains } =
    useQuery(['chains'], async () => lifi.getChains(), {
      refetchInterval: 300000,
      staleTime: 300000,
    });

  const { data: filteredChains, isLoading: isLoadingFilteredChains } = useQuery(
    ['filtered-chains', { keyPrefix, availableChains, chains }],
    async () => {
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
    {
      enabled: Boolean(availableChains),
    },
  );

  const getChainById = useCallback(
    (chainId: number) => availableChains?.find((chain) => chain.id === chainId),
    [availableChains],
  );

  return {
    chains: filteredChains,
    getChainById,
    isLoading: isLoadingAvailableChains || isLoadingFilteredChains,
  };
};
