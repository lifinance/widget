'use client'
import type { Route } from '@lifi/sdk'
import { create, type StoreApi, type UseBoundStore } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export const PENDING_RECORD_VERSION = 2
export const PENDING_STORAGE_KEY = 'lifi-checkout-pending'
export const PENDING_TTL_MS: number = 24 * 60 * 60 * 1000

export type PendingFundingSource = 'wallet' | 'transfer' | 'cash' | 'exchange'
export type PendingProvider = 'mesh' | 'transak'
export type PendingStatus = 'pending' | 'confirmed-no-hash'

export interface PersistedFrozenQuote {
  id: string
  route: Route
  expiresAt: number
}

export interface PendingRecord {
  version: number
  fundingSource: PendingFundingSource
  transactionHash?: string
  depositAddress?: string
  fromChain?: number
  provider?: PendingProvider
  frozenRouteId?: string
  frozenQuote?: PersistedFrozenQuote
  createdAt: number
  expiresAt: number
  status: PendingStatus
}

interface PendingCheckoutState {
  records: Record<string, PendingRecord>
  write: (key: string, record: PendingRecord) => void
  clearForKey: (key: string | null) => void
  clearAll: () => void
}

function isRecordLive(record: PendingRecord, now: number): boolean {
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

// Bypasses Zustand persist's async hydration so the router seed reads on first tick.
export function readPendingRecord(key: string): PendingRecord | null {
  try {
    const raw = localStorage.getItem(PENDING_STORAGE_KEY)
    if (!raw) {
      return null
    }
    const parsed = JSON.parse(raw) as { state?: { records?: unknown } }
    const records = parsed.state?.records
    if (!records || typeof records !== 'object') {
      return null
    }
    const record = (records as Record<string, PendingRecord>)[key]
    if (!record || !isRecordLive(record, Date.now())) {
      return null
    }
    return record
  } catch {
    return null
  }
}

export function resolveResumeKeySync(
  integrator: string,
  walletAddress?: string
): string | null {
  if (walletAddress) {
    return `${integrator}:${walletAddress}`
  }
  try {
    const raw = localStorage.getItem(PENDING_STORAGE_KEY)
    if (!raw) {
      return null
    }
    const parsed = JSON.parse(raw) as { state?: { records?: unknown } }
    const records = parsed.state?.records as
      | Record<string, PendingRecord>
      | undefined
    if (!records) {
      return null
    }
    const now = Date.now()
    const prefix = `${integrator}:`
    let bestKey: string | null = null
    let bestCreatedAt = -1
    for (const [key, record] of Object.entries(records)) {
      if (!key.startsWith(prefix)) {
        continue
      }
      if (!isRecordLive(record, now)) {
        continue
      }
      if (!record.depositAddress) {
        continue
      }
      if (record.createdAt > bestCreatedAt) {
        bestKey = key
        bestCreatedAt = record.createdAt
      }
    }
    return bestKey
  } catch {
    return null
  }
}

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
    fundingSource: partial.fundingSource,
    transactionHash: partial.transactionHash,
    depositAddress: partial.depositAddress,
    fromChain: partial.fromChain,
    provider: partial.provider,
    frozenRouteId: partial.frozenRouteId,
    frozenQuote: partial.frozenQuote,
    status: partial.status,
  }
}
