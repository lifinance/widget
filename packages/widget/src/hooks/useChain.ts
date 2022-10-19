import { useMemo } from 'react';
import { useChains } from './useChains';

export const useChain = (chainId?: number) => {
  const { chains, isLoading } = useChains();

  const chain = useMemo(() => {
    const chain = chains?.find((chain) => chain.id === chainId);
    return chain;
  }, [chainId, chains]);

  return {
    chain,
    isLoading,
  };
};
