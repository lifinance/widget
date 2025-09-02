import type { FormType } from '../form/types.js'

interface ChainOrderProps {
  chainOrder: {
    from: number[]
    to: number[]
  }
  availableChains: {
    from: number[]
    to: number[]
  }
  isAllNetworks: boolean
  pinnedChains: number[]
}

export interface ChainOrderState extends ChainOrderProps {
  initializeChains(chainIds: number[], type: FormType): number[]
  setChain(chainId: number, type: FormType): void
  setIsAllNetworks(isAllNetworks: boolean): void
  setPinnedChain(chainId: number): void
}
