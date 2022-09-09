export interface ChainOrderState {
  chainOrder: number[];
  availableChains: number[];
}

export interface ChainOrderStore extends ChainOrderState {
  initializeChains(chainIds: number[]): number[];
  setChain(chainId: number): void;
}
