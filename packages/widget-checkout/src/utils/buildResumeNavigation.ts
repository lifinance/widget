import type { PendingRecord } from '../stores/usePendingCheckoutStore.js'

// Mirrors checkoutNavigationRoutes; inlined so this util doesn't import the
// routes module (which pulls in @lifi/widget/shared) and break ESM resolution
// in unit tests. Keep in sync with navigationRoutes.ts.
const TRANSACTION_EXECUTION = 'transaction-execution'
const TRANSACTION_STATUS = 'transaction-status'
const TRANSFER_DEPOSIT = '/transfer-deposit'
const HOME = '/'

export interface ResumeNavigation {
  to: string
  search: Record<string, string | number>
}

export interface BuildResumeNavigationOptions {
  /** True when the persisted frozen-quote snapshot is still inside its own TTL. */
  frozenQuoteFresh?: boolean
  /** True once the deposit has been detected on-chain (live status !== NOT_FOUND). */
  depositDetected?: boolean
}

export function buildResumeNavigation(
  record: PendingRecord,
  options: BuildResumeNavigationOptions = {}
): ResumeNavigation {
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
        ...(record.transactionHash
          ? { transactionHash: record.transactionHash }
          : {}),
        resumed: '1',
      },
    }
  }
  // A wallet payment that took a non-IF route has no deposit address — resume the
  // status page by tx hash, which polls getStatus for the in-flight transfer.
  if (record.transactionHash && record.fromChain !== undefined) {
    return {
      to: `/${TRANSACTION_EXECUTION}/${TRANSACTION_STATUS}`,
      search: {
        transactionHash: record.transactionHash,
        fromChain: record.fromChain,
        resumed: '1',
      },
    }
  }
  return { to: HOME, search: {} }
}
