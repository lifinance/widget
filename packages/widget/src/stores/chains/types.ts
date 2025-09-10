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
  isAllNetworksFromChain: boolean
  isAllNetworksToChain: boolean
  pinnedChains: number[]
}

export interface ChainOrderState extends ChainOrderProps {
  initializeChains(chainIds: number[], type: FormType): number[]
  setChain(chainId: number, type: FormType): void
  getIsAllNetworks(formType: FormType): boolean
  setIsAllNetworks(isAllNetworks: boolean, formType: FormType): void
  setPinnedChain(chainId: number): void
}
