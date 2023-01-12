export interface ChainOrderProps {
  chainOrder: number[];
  availableChains: number[];
}

export interface ChainOrderState extends ChainOrderProps {
  initializeChains(chainIds: number[]): number[];
  setChain(chainId: number): void;
}
