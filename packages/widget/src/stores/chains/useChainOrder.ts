import { useMemo } from 'react'
import type { FormType } from '../form/types'
import { useChainOrderStore } from './ChainOrderStore'
import { maxChainsToOrder } from './createChainOrderStore'

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
