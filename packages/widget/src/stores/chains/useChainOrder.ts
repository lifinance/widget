import type { FormType } from '../form/types.js'
import { useChainOrderStore } from './ChainOrderStore.js'
import { maxChainsToOrder } from './createChainOrderStore.js'

export const useChainOrder = (
  type: FormType
): [number[], (chainId: number, type: FormType) => void] => {
  return useChainOrderStore((state) => [
    state.chainOrder[type].slice(0, maxChainsToOrder),
    state.setChain,
  ])
}
