import type { PendingRecord } from '../stores/usePendingCheckoutStore.js'

// Inlined to avoid transitive ESM resolution issues in unit tests.
const TRANSACTION_EXECUTION = 'transaction-execution'
const TRANSACTION_STATUS = 'transaction-status'
const TRANSFER_DEPOSIT = '/transfer-deposit'
const HOME = '/'

export interface BuildResumeUrlOptions {
  /** True when the persisted frozen-quote snapshot is still inside its own TTL. */
  frozenQuoteFresh?: boolean
}

export function buildResumeUrl(
  record: PendingRecord,
  options: BuildResumeUrlOptions = {}
): string {
  const base = `/${TRANSACTION_EXECUTION}/${TRANSACTION_STATUS}`
  if (
    record.fundingSource === 'transfer' &&
    options.frozenQuoteFresh &&
    record.frozenQuote
  ) {
    return `${TRANSFER_DEPOSIT}?resumed=1`
  }
  // Wallet records resume through the deposit-address branch below —
  // intent-factory fulfillment is tracked by the deposit address, not the
  // source tx hash. The hash, when known, rides along for display/details.
  if (record.depositAddress && record.fromChain !== undefined) {
    const addr = encodeURIComponent(record.depositAddress)
    const tx = record.transactionHash
      ? `&transactionHash=${encodeURIComponent(record.transactionHash)}`
      : ''
    return `${base}?depositAddress=${addr}&fromChain=${record.fromChain}${tx}&resumed=1`
  }
  return HOME
}
