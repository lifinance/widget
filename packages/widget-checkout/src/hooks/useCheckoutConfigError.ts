import { useWidgetConfig } from '@lifi/widget/shared'
import { useMemo } from 'react'
import { useCheckoutToAddress } from './useCheckoutToAddress.js'

/** Returns the names of required checkout config fields (toAddress/toChain/toToken) that are missing. */
export function useCheckoutConfigError(): string[] {
  const toAddress = useCheckoutToAddress()
  const { toChain, toToken } = useWidgetConfig()

  return useMemo(() => {
    const missing: string[] = []
    if (!toAddress) {
      missing.push('toAddress')
    }
    if (!toChain) {
      missing.push('toChain')
    }
    if (!toToken) {
      missing.push('toToken')
    }
    return missing
  }, [toAddress, toChain, toToken])
}
