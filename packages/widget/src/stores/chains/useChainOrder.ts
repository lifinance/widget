import { useMemo } from 'react'
import type { FormType } from '../form/types.js'
import { useChainOrderStore } from './ChainOrderStore.js'
import { maxChainsToOrder } from './createChainOrderStore.js'

export const useChainOrder = (
  type: FormType
): [number[], (chainId: number, type: FormType) => void] => {
  const [chainOrder, setChain] = useChainOrderStore((state) => [
    state.chainOrder[type],
    state.setChain,
  ])

  const limitedChainOrder = useMemo(
    () => chainOrder.slice(0, maxChainsToOrder),
    [chainOrder]
  )

  return [limitedChainOrder, setChain]
}
