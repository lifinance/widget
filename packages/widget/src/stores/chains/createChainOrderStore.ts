import type { StateCreator } from 'zustand'
import { persist } from 'zustand/middleware'
import { createWithEqualityFn } from 'zustand/traditional'
import type { PersistStoreProps } from '../types.js'
import type { ChainOrderState } from './types.js'

export const maxChainsToOrder = 9
export const maxChainsToShow = 10
const defaultChainState = {
  from: [],
  to: [],
}

export const createChainOrderStore = ({ namePrefix }: PersistStoreProps) =>
  createWithEqualityFn<ChainOrderState>(
    persist(
      (set, get) => ({
        chainOrder: defaultChainState,
        availableChains: defaultChainState,
        pinnedChains: [],
        initializeChains: (chainIds, type) => {
          set((state: ChainOrderState) => {
            const chainOrder = state.chainOrder[type].filter((chainId) =>
              chainIds.includes(chainId)
            )
            const chainsToAdd = chainIds.filter(
              (chainId) => !chainOrder.includes(chainId)
            )
            if (chainOrder.length === maxChainsToOrder || !chainsToAdd.length) {
              return {
                availableChains: {
                  ...state.availableChains,
                  [type]: chainIds,
                },
                chainOrder: {
                  ...state.chainOrder,
                  [type]: chainOrder,
                },
              }
            }
            const chainsToAddLength = maxChainsToOrder - chainOrder.length
            for (let index = 0; index < chainsToAddLength; index++) {
              chainOrder.push(chainsToAdd[index])
            }
            return {
              availableChains: {
                ...state.availableChains,
                [type]: chainIds,
              },
              chainOrder: {
                ...state.chainOrder,
                [type]: chainOrder,
              },
            }
          })
          return get().chainOrder[type]
        },
        setChain: (chainId, type) => {
          const state = get()
          if (
            state.chainOrder[type].includes(chainId) ||
            !state.availableChains[type].includes(chainId)
          ) {
            return
          }
          set((state: ChainOrderState) => {
            const chainOrder = state.chainOrder[type].slice()
            chainOrder.unshift(chainId)
            if (chainOrder.length > maxChainsToOrder) {
              chainOrder.pop()
            }
            return {
              chainOrder: {
                ...state.chainOrder,
                [type]: chainOrder,
              },
            }
          })
        },
        setPinnedChain: (chainId) => {
          set((state: ChainOrderState) => {
            const pinnedChains = [...state.pinnedChains]
            if (pinnedChains.includes(chainId)) {
              return {
                pinnedChains: pinnedChains.filter((id) => id !== chainId),
              }
            }
            pinnedChains.push(chainId)
            return {
              pinnedChains,
            }
          })
        },
      }),
      {
        name: `${namePrefix || 'li.fi'}-widget-chains-order`,
        version: 2,
        partialize: (state) => ({
          chainOrder: state.chainOrder,
          pinnedChains: state.pinnedChains,
        }),
      }
    ) as StateCreator<ChainOrderState, [], [], ChainOrderState>,
    Object.is
  )
