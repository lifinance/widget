import { useMemo } from 'react'
import { useCheckoutFlowStore } from '../stores/useCheckoutFlowStore.js'
import { INTENT_FACTORY_ONLY } from '../utils/checkoutDefaults.js'

export interface CheckoutToolFilter {
  allowBridges?: string[]
  allowExchanges?: string[]
}

const IF_ONLY_FILTER: CheckoutToolFilter = {
  allowBridges: [...INTENT_FACTORY_ONLY],
  allowExchanges: [...INTENT_FACTORY_ONLY],
}

const NO_FILTER: CheckoutToolFilter = {}

/**
 * Deposit-based funding sources (transfer/exchange/cash) need the IF-only tool
 * filter so `useCheckoutRoutes` surfaces a deposit-address route; the wallet
 * flow pays directly, so it uses any integrator-allowed route.
 *
 * Both axes are pinned. An exchange allow-list only constrains swap steps, so
 * on a cross-chain pair it never binds — the backend answers with ordinary
 * bridge routes that carry no deposit address, and the pre-commit gate then
 * rejects the quote. `fundingOrders.quote.ts` pins both for a SMART_DEPOSIT
 * order, so the preview has to ask for the same thing.
 */
export function useCheckoutToolFilter(): CheckoutToolFilter {
  const fundingSource = useCheckoutFlowStore((s) => s.fundingSource)
  return useMemo(
    () =>
      fundingSource && fundingSource !== 'wallet' ? IF_ONLY_FILTER : NO_FILTER,
    [fundingSource]
  )
}
