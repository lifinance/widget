import type { OrderPhase } from '../../hooks/useFundingOrder.js'

export interface ShouldLeaveDepositPageArgs {
  substatus: string | undefined
  phase: OrderPhase | undefined
}

/**
 * The deposit page is left once funds are detected (any substatus other than
 * the initial `INTENT_AWAITING_FUNDS`) or the order reaches a terminal phase.
 * Orders never expire server-side, so there is no time-based exit condition.
 */
export function shouldLeaveDepositPage({
  substatus,
  phase,
}: ShouldLeaveDepositPageArgs): boolean {
  if (phase === 'done' || phase === 'failed') {
    return true
  }
  return substatus !== undefined && substatus !== 'INTENT_AWAITING_FUNDS'
}
