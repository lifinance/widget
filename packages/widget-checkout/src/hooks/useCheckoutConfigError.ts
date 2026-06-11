import { useWidgetConfig } from '@lifi/widget/shared'
import { useMemo } from 'react'
import { useCheckoutToAddress } from './useCheckoutToAddress.js'
import { useResolvedCheckoutRecipient } from './useResolvedCheckoutRecipient.js'

/** Required config fields that are missing. `toAddress` is fatal only when the user can't set it in-widget. */
export function useCheckoutConfigError(): string[] {
  const toAddress = useCheckoutToAddress()
  const { isUserSettable } = useResolvedCheckoutRecipient()
  const { toChain, toToken } = useWidgetConfig()

  return useMemo(() => {
    const missing: string[] = []
    if (!toAddress && !isUserSettable) {
      missing.push('toAddress')
    }
    if (!toChain) {
      missing.push('toChain')
    }
    if (!toToken) {
      missing.push('toToken')
    }
    return missing
  }, [toAddress, isUserSettable, toChain, toToken])
}
