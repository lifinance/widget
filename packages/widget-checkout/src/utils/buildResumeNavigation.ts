import type { PendingRecord } from '../stores/usePendingCheckoutStore.js'

// Mirrors checkoutNavigationRoutes; inlined so this util doesn't import the
// routes module (which pulls in @lifi/widget/shared) and break ESM resolution
// in unit tests. Keep in sync with navigationRoutes.ts.
const TRANSACTION_EXECUTION = 'transaction-execution'
const TRANSACTION_STATUS = 'transaction-status'
const TRANSFER_DEPOSIT = '/transfer-deposit'
const HOME = '/'

function statusSearch(record: PendingRecord): Record<string, string | number> {
  // Identifier rides along for the details link; deposit polling drives status.
  if (record.transactionHash) {
    return { transactionHash: record.transactionHash }
  }
  if (record.taskId) {
    return { taskId: record.taskId }
  }
  return {}
}

export interface ResumeNavigation {
  to: string
  search: Record<string, string | number>
}

export interface BuildResumeNavigationOptions {
  /** True when the persisted frozen-quote snapshot is still inside its own TTL. */
  frozenQuoteFresh?: boolean
  /** True once the deposit has been detected on-chain (live status !== NOT_FOUND). */
  depositDetected?: boolean
  /**
   * Wallet route present and not finished (in flight or failed). Resume re-attaches
   * SDK execution on the transaction page so the user can continue or retry.
   */
  routeResumable?: boolean
}

export function buildResumeNavigation(
  record: PendingRecord,
  options: BuildResumeNavigationOptions = {}
): ResumeNavigation {
  // An unfinished wallet route (in flight or failed) resumes on the execution
  // page so the SDK can re-attach to prompt/retry; a status page can't advance it.
  if (
    options.routeResumable &&
    record.fundingSource === 'wallet' &&
    record.frozenRouteId
  ) {
    return {
      to: `/${TRANSACTION_EXECUTION}`,
      search: { routeId: record.frozenRouteId, resumed: '1' },
    }
  }
  // Reopen the QR/deposit-address page only while the window is still open AND
  // no deposit has landed yet — so the user can finish sending. Once a deposit
  // is detected, fall through to the status page to track it.
  if (
    record.fundingSource === 'transfer' &&
    options.frozenQuoteFresh &&
    record.frozenQuote &&
    !options.depositDetected
  ) {
    return { to: TRANSFER_DEPOSIT, search: { resumed: '1' } }
  }
  // Deposit-funded flows (and IF wallet routes) resume via the deposit address —
  // fulfillment is tracked by the deposit address, not the source tx hash. The
  // hash, when known, rides along for display/details only.
  if (record.depositAddress && record.fromChain !== undefined) {
    return {
      to: `/${TRANSACTION_EXECUTION}/${TRANSACTION_STATUS}`,
      search: {
        depositAddress: record.depositAddress,
        fromChain: record.fromChain,
        ...statusSearch(record),
        resumed: '1',
      },
    }
  }
  // Non-IF wallet payment, no deposit address and no longer resumable (done on
  // the source side or evicted): poll status by its identifier (taskId/txHash
  // are distinct keys).
  if (
    (record.transactionHash || record.taskId) &&
    record.fromChain !== undefined
  ) {
    return {
      to: `/${TRANSACTION_EXECUTION}/${TRANSACTION_STATUS}`,
      search: {
        ...statusSearch(record),
        fromChain: record.fromChain,
        resumed: '1',
      },
    }
  }
  return { to: HOME, search: {} }
}
