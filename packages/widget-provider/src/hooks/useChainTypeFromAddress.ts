import type { ChainType } from '@lifi/sdk'
import { useCallback } from 'react'
import {
  type AddressChain,
  chainFromAddress,
  chainTypeFromAddress,
  chainTypeFromTokenAddress,
} from '../utils/chainTypeFromAddress.js'
import { useSDKProviders } from './useSDKProviders.js'

export const useChainTypeFromAddress = (): {
  getChainTypeFromAddress: (address: string) => ChainType | undefined
  /** The chain type, plus the chain when only one chain takes the address format. */
  getChainFromAddress: (address: string) => AddressChain | undefined
  /** A token identifier, which several ecosystems shape unlike a wallet address. */
  getChainTypeFromTokenAddress: (address: string) => ChainType | undefined
} => {
  const providers = useSDKProviders()

  const getChainTypeFromAddress = useCallback(
    (address: string): ChainType | undefined =>
      chainTypeFromAddress(providers, address),
    [providers]
  )

  const getChainFromAddress = useCallback(
    (address: string): AddressChain | undefined =>
      chainFromAddress(providers, address),
    [providers]
  )

  const getChainTypeFromTokenAddress = useCallback(
    (address: string): ChainType | undefined =>
      chainTypeFromTokenAddress(providers, address),
    [providers]
  )

  return {
    getChainTypeFromAddress,
    getChainFromAddress,
    getChainTypeFromTokenAddress,
  }
}
