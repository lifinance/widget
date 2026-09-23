import type { StoreApi, UseBoundStore } from 'zustand'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { PersistStoreProps } from '../types.js'
import type {
  RecentToken,
  RecentTokensProps,
  RecentTokensState,
} from './types.js'
import { getTokenKey } from './utils.js'

const recentTokensLimit = 10

const isStoredRecentToken = (value: unknown): value is RecentToken => {
  const token = value as Partial<RecentToken> | null
  return (
    typeof token === 'object' &&
    token !== null &&
    typeof token.chainId === 'number' &&
    typeof token.address === 'string' &&
    typeof token.symbol === 'string' &&
    typeof token.name === 'string' &&
    typeof token.decimals === 'number'
  )
}

export const createRecentTokensStore = ({
  namePrefix,
}: PersistStoreProps): UseBoundStore<StoreApi<RecentTokensState>> =>
  create<RecentTokensState>()(
    persist(
      (set, get) => ({
        recentTokens: [],
        addRecentToken: (token) => {
          const key = getTokenKey(token.chainId, token.address)
          set((state) => ({
            recentTokens: [
              token,
              ...state.recentTokens.filter(
                (t) => getTokenKey(t.chainId, t.address) !== key
              ),
            ].slice(0, recentTokensLimit),
          }))
        },
        removeRecentToken: (chainId, address) => {
          const key = getTokenKey(chainId, address)
          set((state) => ({
            recentTokens: state.recentTokens.filter(
              (t) => getTokenKey(t.chainId, t.address) !== key
            ),
          }))
        },
        clearRecentTokens: (entries) =>
          set((state) => {
            const removed = new Set(
              entries.map((e) => getTokenKey(e.chainId, e.address))
            )
            return {
              recentTokens: state.recentTokens.filter(
                (t) => !removed.has(getTokenKey(t.chainId, t.address))
              ),
            }
          }),
        isRecentToken: (chainId, address) => {
          const key = getTokenKey(chainId, address)
          return get().recentTokens.some(
            (t) => getTokenKey(t.chainId, t.address) === key
          )
        },
      }),
      {
        name: `${namePrefix || 'li.fi'}-recent-tokens`,
        version: 0,
        partialize: (state) => ({
          recentTokens: state.recentTokens,
        }),
        // The key lives on the integrator's origin, so its content is untrusted.
        merge: (persisted, current) => {
          const stored = (persisted as Partial<RecentTokensProps> | undefined)
            ?.recentTokens
          return {
            ...current,
            recentTokens: Array.isArray(stored)
              ? stored.filter(isStoredRecentToken).slice(0, recentTokensLimit)
              : [],
          }
        },
      }
    )
  )
