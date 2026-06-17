import { useWidgetConfig } from '@lifi/widget/shared'
import { useMemo } from 'react'

/**
 * The checkout recipient — always the integrator-configured `config.toAddress`,
 * never the funding wallet. `null` means misconfigured (handled by CheckoutConfigGuard).
 */
export function useCheckoutToAddress(): string | null {
  const { toAddress } = useWidgetConfig()

  return useMemo<string | null>(() => {
    if (!toAddress) {
      return null
    }
    return typeof toAddress === 'string' ? toAddress : toAddress.address
  }, [toAddress])
}
