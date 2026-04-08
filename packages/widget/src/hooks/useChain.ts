import type { ExtendedChain } from '@lifi/sdk'
import { useMemo } from 'react'
import { useAvailableChains } from './useAvailableChains.js'

export const useChain = (
  chainId?: number
): {
  chain: ExtendedChain | undefined
  isLoading: boolean
  getChainById: (
    chainId?: number,
    chains?: ExtendedChain[]
  ) => ExtendedChain | undefined
} => {
  const { isLoading, getChainById } = useAvailableChains()

  const chain = useMemo(() => getChainById(chainId), [chainId, getChainById])

  return {
    chain,
    isLoading,
    getChainById,
  }
}
