import { shallow } from 'zustand/shallow';
import type { FormType } from '../form';
import { useChainOrderStore } from './ChainOrderStore';

export const useChainOrder = (
  type: FormType,
): [number[], (chainId: number, type: FormType) => void] => {
  return useChainOrderStore(
    (state) => [state.chainOrder[type], state.setChain],
    shallow,
  );
};
