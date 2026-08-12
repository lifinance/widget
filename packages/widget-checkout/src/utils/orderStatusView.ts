import type { FundingOrder, FundingOrderLateDelivery, Route } from '@lifi/sdk'
import { convertOrderToRoute, convertQuoteToRoute } from '@lifi/sdk'

export type OrderStatusPhase = 'watching' | 'pending' | 'done' | 'failed'

export interface OrderStatusView {
  phase: OrderStatusPhase
  substatus?: string
  /** Source-chain hash. `getStatus({ txHash })` resolves by this one. */
  fromTxHash?: string
  toTxHash?: string
  toAmount?: string
  /** Display route derived from the committed quote; absent for DIRECT onramp. */
  displayRoute?: Route
  lateDelivery?: FundingOrderLateDelivery
}

// Substatuses where the order still awaits the user's action (a deposit or a
// fiat payment) — the pre-flight "watching" screen, not the in-flight one.
const AWAITING_ACTION_SUBSTATUSES = new Set([
  'INTENT_AWAITING_FUNDS',
  'ONRAMP_AWAITING_PAYMENT',
])

/**
 * Whether the order is still waiting on the user to do something (send a
 * deposit, pay a fiat invoice) rather than on us. The single source of truth
 * for that question — the busy gate, auto-resume and the status screens all
 * read it, so a new awaiting substatus only has to be added above.
 */
export function isAwaitingUserAction(order: FundingOrder | undefined): boolean {
  if (!order || order.status === 'DONE' || order.status === 'FAILED') {
    return false
  }
  return Boolean(
    order.substatus && AWAITING_ACTION_SUBSTATUSES.has(order.substatus)
  )
}

function resolvePhase(order: FundingOrder | undefined): OrderStatusPhase {
  if (!order) {
    return 'watching'
  }
  if (order.status === 'DONE') {
    return 'done'
  }
  if (order.status === 'FAILED') {
    return 'failed'
  }
  if (isAwaitingUserAction(order)) {
    return 'watching'
  }
  return 'pending'
}

// `convertOrderToRoute` throws for any order whose type isn't STANDARD (it
// stamps `fundingOrderId` for `executeRoute`, which only STANDARD orders go
// through). Non-STANDARD orders reuse the lower-level quote converter for
// display purposes only — this route is never executed. A malformed quote
// falls back to no route rather than crashing the caller.
function resolveDisplayRoute(
  order: FundingOrder | undefined
): Route | undefined {
  if (!order) {
    return undefined
  }
  if (order.type === 'STANDARD') {
    try {
      return convertOrderToRoute(order)
    } catch {
      return undefined
    }
  }
  if (order.quote) {
    try {
      const route = convertQuoteToRoute(order.quote)
      route.id = order.orderId
      return route
    } catch {
      return undefined
    }
  }
  return undefined
}

export function orderStatusView(
  order: FundingOrder | undefined
): OrderStatusView {
  return {
    phase: resolvePhase(order),
    substatus: order?.substatus,
    fromTxHash: order?.result?.fromTxHash,
    toTxHash: order?.result?.toTxHash,
    toAmount: order?.result?.toAmount,
    displayRoute: resolveDisplayRoute(order),
    lateDelivery: order?.lateDelivery,
  }
}
