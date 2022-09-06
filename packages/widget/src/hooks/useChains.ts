import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useLiFi, useWidgetConfig } from '../providers';
import { useSetChainOrder } from '../stores/chains';

export const useChains = () => {
  const { disabledChains } = useWidgetConfig();
  const lifi = useLiFi();
  const [, initializeChains] = useSetChainOrder();
  const { data, isLoading } = useQuery(['chains'], async () => {
    const chains = await lifi.getChains();
    const filteredChains = chains.filter(
      (chain) => !disabledChains?.includes(chain.id),
    );
    initializeChains(filteredChains.map((chain) => chain.id));
    return filteredChains;
  });

  const getChainById = useCallback(
    (chainId: number) => {
      const chain = data?.find((chain) => chain.id === chainId);
      // if (!chain) {
      //   throw new Error('Chain not found or chainId is invalid.');
      // }
      return chain;
    },
    [data],
  );

  return { chains: data, getChainById, isLoading };
};
