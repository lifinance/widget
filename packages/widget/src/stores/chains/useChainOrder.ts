import { shallow } from 'zustand/shallow';
import type { FormType } from '../form/types.js';
import { useChainOrderStore } from './ChainOrderStore.js';

export const useChainOrder = (
  type: FormType,
): [number[], (chainId: number, type: FormType) => void] => {
  return useChainOrderStore(
    (state) => [state.chainOrder[type], state.setChain],
    shallow,
  );
};
