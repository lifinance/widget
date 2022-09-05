import shallow from 'zustand/shallow';
import { useChainOrderStore } from './useChainOrderStore';

export const useSetChainOrder = (): [
  (chainId: number) => void,
  (chainIds: number[]) => void,
] => {
  return useChainOrderStore(
    (state) => [state.setChain, state.initializeChains],
    shallow,
  );
};
