import type { FormType } from '../form/types.js';

export interface ChainOrderProps {
  chainOrder: {
    from: number[];
    to: number[];
  };
  availableChains: {
    from: number[];
    to: number[];
  };
}

export interface ChainOrderState extends ChainOrderProps {
  initializeChains(chainIds: number[], type: FormType): number[];
  setChain(chainId: number, type: FormType): void;
}
