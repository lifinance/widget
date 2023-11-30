import { useCallback } from 'react';
import { useChainValues } from '../stores/chains/ChainValuesProvider';

export const useChains = () => {
  const { chains, availableChains, isLoading } = useChainValues();

  const getChainById = useCallback(
    (chainId: number) => availableChains?.find((chain) => chain.id === chainId),
    [availableChains],
  );

  return {
    chains,
    getChainById,
    isLoading,
  };
};
