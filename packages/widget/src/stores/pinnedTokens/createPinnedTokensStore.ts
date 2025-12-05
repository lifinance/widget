import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { PersistStoreProps } from '../types.js'
import type { PinnedTokensState } from './types.js'

export const createPinnedTokensStore = ({ namePrefix }: PersistStoreProps) =>
  create<PinnedTokensState>()(
    persist(
      (set, get) => ({
        pinnedTokens: {},
        pinToken: (chainId: number, tokenAddress: string) => {
          set((state) => {
            const normalizedAddress = tokenAddress.toLowerCase()
            const chainTokens = state.pinnedTokens[chainId] || []
            if (!chainTokens.includes(normalizedAddress)) {
              return {
                pinnedTokens: {
                  ...state.pinnedTokens,
                  [chainId]: [...chainTokens, normalizedAddress],
                },
              }
            }
            return state
          })
        },
        unpinToken: (chainId: number, tokenAddress: string) => {
          set((state) => {
            const normalizedAddress = tokenAddress.toLowerCase()
            const chainTokens = state.pinnedTokens[chainId] || []
            if (chainTokens.includes(normalizedAddress)) {
              return {
                pinnedTokens: {
                  ...state.pinnedTokens,
                  [chainId]: chainTokens.filter(
                    (addr) => addr !== normalizedAddress
                  ),
                },
              }
            }
            return state
          })
        },
        isPinned: (chainId: number, tokenAddress: string) => {
          const normalizedAddress = tokenAddress.toLowerCase()
          const chainTokens = get().pinnedTokens[chainId] || []
          return chainTokens.includes(normalizedAddress)
        },
        getPinnedTokens: (chainId: number) => {
          return get().pinnedTokens[chainId] || []
        },
        getAllPinnedTokens: () => {
          const allPinned: Array<{ chainId: number; tokenAddress: string }> = []
          const pinnedTokens = get().pinnedTokens
          Object.entries(pinnedTokens).forEach(([chainIdStr, addresses]) => {
            const chainId = Number.parseInt(chainIdStr, 10)
            addresses.forEach((address) => {
              allPinned.push({ chainId, tokenAddress: address })
            })
          })
          return allPinned
        },
      }),
      {
        name: `${namePrefix || 'li.fi'}-pinned-tokens`,
        version: 0,
        partialize: (state) => ({
          pinnedTokens: state.pinnedTokens,
        }),
      }
    )
  )
