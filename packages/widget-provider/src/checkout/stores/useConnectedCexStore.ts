'use client'
import { useMemo } from 'react'
import { create, type StoreApi, type UseBoundStore } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { OnRampAccessToken } from '../types.js'

export const CONNECTED_CEX_VERSION = 1
export const CONNECTED_CEX_STORAGE_KEY = 'lifi-checkout-connected-cex'
/** Used when Mesh omits `expiresInSeconds` on a connected account. */
export const DEFAULT_CEX_ACCOUNT_TTL_MS: number = 30 * 60 * 1000

/**
 * Extends `OnRampAccessToken` so it passes straight back into a provider's
 * `open()` without remapping. `accessToken` holds Mesh's stable `tokenId` (Mesh
 * Managed Tokens), not a raw credential — but it's still scoped to
 * sessionStorage (cleared on tab close) and expired at `expiresAt`.
 */
export interface ConnectedCexBrand {
  logoLight?: string
  logoDark?: string
}

export interface ConnectedCexAccount extends OnRampAccessToken {
  brand?: ConnectedCexBrand
  connectedAt: number
  expiresAt: number
}

interface ConnectedCexState {
  records: Record<string, ConnectedCexAccount[]>
  addConnectedAccounts: (key: string, accounts: ConnectedCexAccount[]) => void
  removeAccount: (key: string, accountId: string) => void
}

export function connectedCexKey(integrator: string, userId: string): string {
  return `${integrator}:${userId}`
}

function sweepExpired(
  records: Record<string, ConnectedCexAccount[]>,
  now: number
): Record<string, ConnectedCexAccount[]> {
  const out: Record<string, ConnectedCexAccount[]> = {}
  for (const [key, accounts] of Object.entries(records)) {
    const live = accounts.filter((a) => a.expiresAt > now)
    if (live.length) {
      out[key] = live
    }
  }
  return out
}

/** De-dupes by `accountId`; newest write wins. */
function mergeAccounts(
  existing: ConnectedCexAccount[] | undefined,
  incoming: ConnectedCexAccount[]
): ConnectedCexAccount[] {
  const byId = new Map<string, ConnectedCexAccount>()
  for (const account of existing ?? []) {
    byId.set(account.accountId, account)
  }
  for (const account of incoming) {
    byId.set(account.accountId, account)
  }
  return [...byId.values()]
}

export const useConnectedCexStore: UseBoundStore<StoreApi<ConnectedCexState>> =
  create<ConnectedCexState>()(
    persist(
      (set) => ({
        records: {},
        addConnectedAccounts: (key, accounts) => {
          if (!accounts.length) {
            return
          }
          set((state) => {
            // Only prune the touched key — sweeping every integrator's records
            // on each write would mutate slots this call has nothing to do
            // with. Whole-store hygiene happens once on rehydrate.
            const now = Date.now()
            const merged = mergeAccounts(state.records[key], accounts).filter(
              (a) => a.expiresAt > now
            )
            if (!merged.length) {
              const { [key]: _removed, ...rest } = state.records
              return { records: rest }
            }
            return {
              records: {
                ...state.records,
                [key]: merged,
              },
            }
          })
        },
        removeAccount: (key, accountId) =>
          set((state) => {
            const list = state.records[key]
            if (!list) {
              return state
            }
            const next = list.filter((a) => a.accountId !== accountId)
            if (next.length === list.length) {
              return state
            }
            if (!next.length) {
              const { [key]: _removed, ...rest } = state.records
              return { records: rest }
            }
            return { records: { ...state.records, [key]: next } }
          }),
      }),
      {
        name: CONNECTED_CEX_STORAGE_KEY,
        storage: createJSONStorage(() => sessionStorage),
        partialize: (state) => ({ records: state.records }),
        onRehydrateStorage: () => (rehydrated, error) => {
          if (error || !rehydrated) {
            return
          }
          rehydrated.records = sweepExpired(rehydrated.records, Date.now())
        },
        version: CONNECTED_CEX_VERSION,
      }
    )
  )

const EMPTY_ACCOUNTS: ConnectedCexAccount[] = []

/**
 * Subscribes to the live (non-expired) connected accounts for `key`. Returns a
 * stable empty array when `key` is null or no live accounts exist.
 */
export function useConnectedCexAccounts(
  key: string | null
): ConnectedCexAccount[] {
  const records = useConnectedCexStore((s) => s.records)
  return useMemo(() => {
    if (!key) {
      return EMPTY_ACCOUNTS
    }
    const list = records[key]
    if (!list?.length) {
      return EMPTY_ACCOUNTS
    }
    const now = Date.now()
    const live = list.filter((a) => a.expiresAt > now)
    return live.length ? live : EMPTY_ACCOUNTS
  }, [records, key])
}
