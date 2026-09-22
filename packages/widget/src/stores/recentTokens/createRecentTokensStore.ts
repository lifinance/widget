import type { StoreApi, UseBoundStore } from 'zustand'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { PersistStoreProps } from '../types.js'
import type { RecentTokensState } from './types.js'

const recentTokensLimit = 10

export const createRecentTokensStore = ({
  namePrefix,
}: PersistStoreProps): UseBoundStore<StoreApi<RecentTokensState>> =>
  create<RecentTokensState>()(
    persist(
      (set, get) => ({
        recentTokens: [],
        addRecentToken: (token) => {
          const address = token.address.toLowerCase()
          set((state) => ({
            recentTokens: [
              token,
              ...state.recentTokens.filter(
                (t) =>
                  !(
                    t.chainId === token.chainId &&
                    t.address.toLowerCase() === address
                  )
              ),
            ].slice(0, recentTokensLimit),
          }))
        },
        removeRecentToken: (chainId, address) => {
          const normalizedAddress = address.toLowerCase()
          set((state) => ({
            recentTokens: state.recentTokens.filter(
              (t) =>
                !(
                  t.chainId === chainId &&
                  t.address.toLowerCase() === normalizedAddress
                )
            ),
          }))
        },
        clearRecentTokens: (entries) =>
          set((state) => {
            const removed = new Set(
              entries.map((e) => `${e.chainId}-${e.address.toLowerCase()}`)
            )
            return {
              recentTokens: state.recentTokens.filter(
                (t) => !removed.has(`${t.chainId}-${t.address.toLowerCase()}`)
              ),
            }
          }),
        isRecentToken: (chainId, address) => {
          const normalizedAddress = address.toLowerCase()
          return get().recentTokens.some(
            (t) =>
              t.chainId === chainId &&
              t.address.toLowerCase() === normalizedAddress
          )
        },
      }),
      {
        name: `${namePrefix || 'li.fi'}-recent-tokens`,
        version: 0,
        partialize: (state) => ({
          recentTokens: state.recentTokens,
        }),
      }
    )
  )
