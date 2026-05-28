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
  if (record.fundingSource === 'wallet' && record.transactionHash) {
    const tx = encodeURIComponent(record.transactionHash)
    return `${base}?transactionHash=${tx}&resumed=1`
  }
  if (record.depositAddress && record.fromChain !== undefined) {
    const addr = encodeURIComponent(record.depositAddress)
    return `${base}?depositAddress=${addr}&fromChain=${record.fromChain}&resumed=1`
  }
  return HOME
}
