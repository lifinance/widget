import { useMemo } from 'react'
import { useCheckoutFlowStore } from '../stores/useCheckoutFlowStore.js'
import { INTENT_FACTORY_ONLY } from '../utils/checkoutDefaults.js'

/**
 * Deposit-based funding sources (transfer/exchange/cash) need the IF-only
 * exchange allow-list so `useCheckoutRoutes` surfaces a deposit-address
 * route; the wallet flow pays directly, so it uses any integrator-allowed
 * route. Memoized so non-wallet flows hand out a stable array identity
 * instead of a fresh one every render.
 */
export function useCheckoutAllowExchanges(): string[] | undefined {
  const fundingSource = useCheckoutFlowStore((s) => s.fundingSource)
  return useMemo(
    () =>
      fundingSource && fundingSource !== 'wallet'
        ? [...INTENT_FACTORY_ONLY]
        : undefined,
    [fundingSource]
  )
}
