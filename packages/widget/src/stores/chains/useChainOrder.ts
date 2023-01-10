import { shallow } from 'zustand/shallow';
import { useChainOrderStore } from './useChainOrderStore';

export const useChainOrder = (): [number[], (chainId: number) => void] => {
  return useChainOrderStore(
    (state) => [state.chainOrder, state.setChain],
    shallow,
  );
};
