import { useMemo } from 'react';
import { useChains } from './useChains';

export const useChain: any = (chainId?: number) => {
  const { chains, isLoading } = useChains();

  const chain = useMemo(() => {
    const chain = chains?.find((chain: any) => chain.id === chainId);
    return chain;
  }, [chainId, chains]);

  return {
    chain,
    isLoading,
  };
};
