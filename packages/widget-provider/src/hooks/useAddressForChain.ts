import type { ChainType } from '@lifi/sdk'
import { useCallback } from 'react'
import {
  type IsAddressForChain,
  isAddressForChain,
} from '../utils/chainTypeFromAddress.js'
import { useProvidersByChainType } from './useProvidersByChainType.js'

export const useAddressForChain = (): {
  /** Whether `address` can receive on `chain`; `false` without a provider for its ecosystem. */
  isAddressForChain: IsAddressForChain
  /** Whether a provider serves `chainType`, so that a `false` above is a real rejection. */
  hasProviderFor: (chainType: ChainType) => boolean
} => {
  const providers = useProvidersByChainType()

  const checkAddressForChain = useCallback<IsAddressForChain>(
    (address, chain) => isAddressForChain(providers, address, chain),
    [providers]
  )

  const hasProviderFor = useCallback(
    (chainType: ChainType): boolean => Boolean(providers[chainType]),
    [providers]
  )

  return { isAddressForChain: checkAddressForChain, hasProviderFor }
}
