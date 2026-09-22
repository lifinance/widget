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
              { ...token, address },
              ...state.recentTokens.filter(
                (t) => !(t.chainId === token.chainId && t.address === address)
              ),
            ].slice(0, recentTokensLimit),
          }))
        },
        removeRecentToken: (chainId, address) => {
          const normalizedAddress = address.toLowerCase()
          set((state) => ({
            recentTokens: state.recentTokens.filter(
              (t) => !(t.chainId === chainId && t.address === normalizedAddress)
            ),
          }))
        },
        clearRecentTokens: () => set({ recentTokens: [] }),
        isRecentToken: (chainId, address) => {
          const normalizedAddress = address.toLowerCase()
          return get().recentTokens.some(
            (t) => t.chainId === chainId && t.address === normalizedAddress
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
