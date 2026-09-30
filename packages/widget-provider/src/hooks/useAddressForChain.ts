import { useCallback } from 'react'
import {
  type IsAddressForChain,
  isAddressForChain,
} from '../utils/chainTypeFromAddress.js'
import { useSDKProviders } from './useSDKProviders.js'

export const useAddressForChain = (): {
  /** Whether `address` can receive on `chain`; `false` without a provider that serves it. */
  isAddressForChain: IsAddressForChain
} => {
  const providers = useSDKProviders()

  const checkAddressForChain = useCallback<IsAddressForChain>(
    (address, chain) => isAddressForChain(providers, address, chain),
    [providers]
  )

  return { isAddressForChain: checkAddressForChain }
}
