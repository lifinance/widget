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
  fromShowAllNetworks: boolean
  toShowAllNetworks: boolean
  fromIsAllNetworks: boolean
  toIsAllNetworks: boolean
  pinnedChains: number[]
}

export interface ChainOrderState extends ChainOrderProps {
  initializeChains(chainIds: number[], type: FormType): number[]
  setChain(chainId: number, type: FormType): void
  setIsAllNetworks(isAllNetworks: boolean, formType: FormType): void
  setShowAllNetworks(showAllNetworks: boolean, formType: FormType): void
  setPinnedChain(chainId: number): void
}
