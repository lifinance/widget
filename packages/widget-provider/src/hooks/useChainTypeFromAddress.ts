import type { ChainType } from '@lifi/sdk'
import { useCallback } from 'react'
import {
  chainTypeFromAddress,
  chainTypeFromTokenAddress,
} from '../utils/chainTypeFromAddress.js'
import { useProvidersByChainType } from './useProvidersByChainType.js'

export const useChainTypeFromAddress = (): {
  getChainTypeFromAddress: (address: string) => ChainType | undefined
  /** A token identifier, which several ecosystems shape unlike a wallet address. */
  getChainTypeFromTokenAddress: (address: string) => ChainType | undefined
} => {
  const providers = useProvidersByChainType()

  const getChainTypeFromAddress = useCallback(
    (address: string): ChainType | undefined =>
      chainTypeFromAddress(providers, address),
    [providers]
  )

  const getChainTypeFromTokenAddress = useCallback(
    (address: string): ChainType | undefined =>
      chainTypeFromTokenAddress(providers, address),
    [providers]
  )

  return { getChainTypeFromAddress, getChainTypeFromTokenAddress }
}
