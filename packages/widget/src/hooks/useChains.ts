import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormKey, isItemAllowed, useLiFi, useWidgetConfig } from '../providers';
import { useChainOrderStore } from '../stores';

export const useChains = () => {
  const { chains } = useWidgetConfig();
  const lifi = useLiFi();
  const { getValues, setValue } = useFormContext();
  const initializeChains = useChainOrderStore(
    (state) => state.initializeChains,
  );
  const { data, isLoading } = useQuery(
    ['chains'],
    async () => {
      const availableChains = await lifi.getChains();
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
      return { availableChains, filteredChains };
    },
    {
      refetchInterval: 180000,
      staleTime: 180000,
    },
  );

  const getChainById = useCallback(
    (chainId: number) => {
      const chain = data?.availableChains.find((chain) => chain.id === chainId);
      // if (!chain) {
      //   throw new Error('Chain not found or chainId is invalid.');
      // }
      return chain;
    },
    [data],
  );

  return { chains: data?.filteredChains, getChainById, isLoading };
};
