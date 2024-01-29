import { useMemo } from 'react';
import { useAvailableChains } from './useAvailableChains';

export const useChain = (chainId?: number) => {
  const { isLoading, getChainById } = useAvailableChains();

  const chain = useMemo(() => getChainById(chainId), [chainId, getChainById]);

  return {
    chain,
    isLoading,
  };
};
