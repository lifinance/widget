'use client'
import type { Route } from '@lifi/sdk'
import { create, type StoreApi, type UseBoundStore } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export const PENDING_RECORD_VERSION = 3
export const PENDING_STORAGE_KEY = 'lifi-checkout-pending'
export const PENDING_TTL_MS: number = 24 * 60 * 60 * 1000

export type PendingFundingSource = 'wallet' | 'transfer' | 'cash' | 'exchange'
export type PendingProvider = 'mesh' | 'transak'
export type PendingStatus = 'pending' | 'confirmed-no-hash' | 'failed'

export interface PersistedFrozenQuote {
  id: string
  route: Route
  expiresAt: number
}

export interface PendingRecord {
  version: number
  /** Stable per-deposit id, frozen at first write; embedded in the record key. */
  depositId?: string
  fundingSource: PendingFundingSource
  transactionHash?: string
  depositAddress?: string
  fromChain?: number
  provider?: PendingProvider
  frozenRouteId?: string
  frozenQuote?: PersistedFrozenQuote
  // Display fields, written so the activity card renders without the quote.
  fromAmount?: string
  tokenSymbol?: string
  tokenDecimals?: number
  tokenLogoURI?: string
  createdAt: number
  expiresAt: number
  status: PendingStatus
}

interface PendingCheckoutState {
  records: Record<string, PendingRecord>
  write: (key: string, record: PendingRecord) => void
  markFailed: (key: string) => void
  clearForKey: (key: string | null) => void
  clearAll: () => void
}

export function isRecordLive(record: PendingRecord, now: number): boolean {
  return record.version === PENDING_RECORD_VERSION && record.expiresAt > now
}

function sweepExpired(
  records: Record<string, PendingRecord>,
  now: number
): Record<string, PendingRecord> {
  const out: Record<string, PendingRecord> = {}
  for (const [key, record] of Object.entries(records)) {
    if (isRecordLive(record, now)) {
      out[key] = record
    }
  }
  return out
}

export const usePendingCheckoutStore: UseBoundStore<
  StoreApi<PendingCheckoutState>
> = create<PendingCheckoutState>()(
  persist(
    (set) => ({
      records: {},
      write: (key, record) =>
        set((state) => ({
          records: {
            ...sweepExpired(state.records, Date.now()),
            [key]: record,
          },
        })),
      markFailed: (key) =>
        set((state) => {
          const record = state.records[key]
          if (!record || record.status === 'failed') {
            return state
          }
          return {
            records: {
              ...state.records,
              [key]: { ...record, status: 'failed' },
            },
          }
        }),
      clearForKey: (key) => {
        if (!key) {
          return
        }
        set((state) => {
          if (!(key in state.records)) {
            return state
          }
          const { [key]: _removed, ...rest } = state.records
          return { records: rest }
        })
      },
      clearAll: () => set({ records: {} }),
    }),
    {
      name: PENDING_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ records: state.records }),
      onRehydrateStorage: () => (rehydrated, error) => {
        if (error || !rehydrated) {
          return
        }
        rehydrated.records = sweepExpired(rehydrated.records, Date.now())
      },
      version: PENDING_RECORD_VERSION,
    }
  )
)

export function buildResumeKey(integrator: string, identifier: string): string {
  return `${integrator}:${identifier}`
}

export function buildPendingRecord(
  partial: Omit<PendingRecord, 'version' | 'createdAt' | 'expiresAt'> & {
    createdAt?: number
  }
): PendingRecord {
  const createdAt = partial.createdAt ?? Date.now()
  return {
    version: PENDING_RECORD_VERSION,
    createdAt,
    expiresAt: createdAt + PENDING_TTL_MS,
    depositId: partial.depositId,
    fundingSource: partial.fundingSource,
    transactionHash: partial.transactionHash,
    depositAddress: partial.depositAddress,
    fromChain: partial.fromChain,
    provider: partial.provider,
    frozenRouteId: partial.frozenRouteId,
    frozenQuote: partial.frozenQuote,
    fromAmount: partial.fromAmount,
    tokenSymbol: partial.tokenSymbol,
    tokenDecimals: partial.tokenDecimals,
    tokenLogoURI: partial.tokenLogoURI,
    status: partial.status,
  }
}
