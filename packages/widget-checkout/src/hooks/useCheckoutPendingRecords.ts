'use client'
import type { StatusResponse } from '@lifi/sdk'
import { useSDKClient } from '@lifi/widget/shared'
import { useCheckoutConfig } from '@lifi/widget-provider/checkout'
import { useQueries } from '@tanstack/react-query'
import { useEffect, useMemo } from 'react'
import {
  PENDING_RECORD_VERSION,
  type PendingRecord,
  usePendingCheckoutStore,
} from '../stores/usePendingCheckoutStore.js'
import { getDepositAddressStatus } from '../utils/depositAddressStatus.js'
import {
  computeBackoffInterval,
  depositAddressQueryKey,
} from '../utils/statusPolling.js'

export type PendingActivityState = 'deposit' | 'refund' | 'failed'

export interface PendingActivityItem {
  key: string
  record: PendingRecord
  /** Live state derived from the poll: a deposit/refund in progress, or failed. */
  state: PendingActivityState
  /** True once the deposit has been detected on-chain (status !== NOT_FOUND). */
  depositDetected: boolean
}

// The deposit-address poll is the single reconciler: done/refunded clears the
// record, failed marks it (kept as a dismissible card). No address → no poll.
export function useCheckoutPendingRecords(): PendingActivityItem[] {
  const { integrator } = useCheckoutConfig()
  const sdkClient = useSDKClient()
  const records = usePendingCheckoutStore((s) => s.records)
  const clearForKey = usePendingCheckoutStore((s) => s.clearForKey)
  const markFailed = usePendingCheckoutStore((s) => s.markFailed)

  const entries = useMemo(() => {
    const now = Date.now()
    const prefix = `${integrator}:`
    return Object.entries(records)
      .filter(
        ([key, record]) =>
          key.startsWith(prefix) &&
          record.version === PENDING_RECORD_VERSION &&
          record.expiresAt > now
      )
      .sort(([, a], [, b]) => b.createdAt - a.createdAt)
  }, [records, integrator])

  const results = useQueries({
    queries: entries.map(([key, record]) => {
      const canPoll =
        !!record.depositAddress &&
        record.fromChain !== undefined &&
        record.status !== 'failed'
      return {
        queryKey: canPoll
          ? depositAddressQueryKey(record.depositAddress, record.fromChain)
          : ['checkout-activity-idle', key],
        queryFn: async ({
          signal,
        }: {
          signal: AbortSignal
        }): Promise<StatusResponse | undefined> =>
          getDepositAddressStatus({
            sdkClient,
            depositAddress: record.depositAddress as string,
            fromChain: record.fromChain as number,
            signal,
          }),
        enabled: canPoll,
        refetchInterval: () => computeBackoffInterval(record.createdAt),
      }
    }),
  })

  // A compact signature of every polled terminal status, so reconciliation
  // fires only when a status actually changes — not on every render.
  const reconcileSignature = entries
    .map(([key], i) => {
      const data = results[i]?.data
      return `${key}:${data?.status ?? ''}:${data?.substatus ?? ''}`
    })
    .join('|')

  // biome-ignore lint/correctness/useExhaustiveDependencies: reconcileSignature encodes the only inputs that should retrigger reconciliation; depending on `results`/`entries` directly would re-run every render.
  useEffect(() => {
    entries.forEach(([key], i) => {
      const data = results[i]?.data
      if (!data) {
        return
      }
      // A settled refund (REFUNDED) and a completed deposit (DONE) are terminal.
      // An in-progress refund stays live so it shows as "refund in progress".
      const isRefund =
        data.substatus === 'REFUND_IN_PROGRESS' || data.substatus === 'REFUNDED'
      if (data.status === 'DONE' || data.substatus === 'REFUNDED') {
        clearForKey(key)
      } else if (
        (data.status === 'FAILED' || data.status === 'INVALID') &&
        !isRefund
      ) {
        markFailed(key)
      }
    })
  }, [reconcileSignature, clearForKey, markFailed])

  return entries.map(([key, record], i) => {
    const data = results[i]?.data
    const depositDetected = Boolean(data && data.status !== 'NOT_FOUND')
    let state: PendingActivityState
    if (data?.substatus === 'REFUND_IN_PROGRESS') {
      state = 'refund'
    } else if (
      data?.status === 'FAILED' ||
      data?.status === 'INVALID' ||
      record.status === 'failed'
    ) {
      state = 'failed'
    } else {
      state = 'deposit'
    }
    return { key, record, state, depositDetected }
  })
}
