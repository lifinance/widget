import { useQuery } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
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

  const filteredChains = useMemo(() => {
    if (!availableChains) {
      return;
    }

    const filteredAvailableChains = availableChains.filter((chain) =>
      isItemAllowed(chain.id, chains),
    );
    const chainOrder = initializeChains(
      filteredAvailableChains.map((chain) => chain.id),
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
    return filteredAvailableChains;
  }, [
    keyPrefix,
    chains,
    availableChains,
    getValues,
    setValue,
    initializeChains,
  ]);

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
