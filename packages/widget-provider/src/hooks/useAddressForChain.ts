import { useCallback } from 'react'
import {
  type IsAddressForChain,
  isAddressForChain,
} from '../utils/chainTypeFromAddress.js'
import { useProvidersByChainType } from './useProvidersByChainType.js'

export const useAddressForChain = (): {
  /** Whether `address` can receive on `chain`; `false` without a provider for its ecosystem. */
  isAddressForChain: IsAddressForChain
} => {
  const providers = useProvidersByChainType()

  const checkAddressForChain = useCallback<IsAddressForChain>(
    (address, chain) => isAddressForChain(providers, address, chain),
    [providers]
  )

  return { isAddressForChain: checkAddressForChain }
}
