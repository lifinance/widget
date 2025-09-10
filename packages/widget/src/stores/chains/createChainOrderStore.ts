import type { StateCreator } from 'zustand'
import { persist } from 'zustand/middleware'
import { createWithEqualityFn } from 'zustand/traditional'
import type { PersistStoreProps } from '../types.js'
import type { ChainOrderState } from './types.js'

// (10 tiles: 9 + 1 for "All chains")
export const maxGridItemsToShow = 10
export const maxChainsToShow = maxGridItemsToShow - 1
// If there are more than maxChainsToShow chains to show,
// -1 tile to show a button "+ N" more chains
export const maxChainsToOrder = maxChainsToShow - 1

const defaultChainState = {
  from: [],
  to: [],
}

export const createChainOrderStore = ({ namePrefix }: PersistStoreProps) =>
  createWithEqualityFn<ChainOrderState>(
    persist(
      (set, get) => ({
        chainOrder: defaultChainState,
        isAllNetworksFromChain: true,
        isAllNetworksToChain: true,
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
          return get().chainOrder[type].slice(0, maxChainsToOrder)
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
            const chainOrder = [chainId, ...state.chainOrder[type]].slice(
              0,
              maxChainsToOrder
            )
            return {
              chainOrder: {
                ...state.chainOrder,
                [type]: chainOrder,
              },
            }
          })
        },
        getIsAllNetworks: (formType) => {
          return formType === 'from'
            ? get().isAllNetworksFromChain
            : get().isAllNetworksToChain
        },
        setIsAllNetworks: (isAllNetworks, formType) => {
          if (formType === 'from') {
            set({ isAllNetworksFromChain: isAllNetworks })
          } else {
            set({ isAllNetworksToChain: isAllNetworks })
          }
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
          isAllNetworksFromChain: state.isAllNetworksFromChain,
          isAllNetworksToChain: state.isAllNetworksToChain,
          pinnedChains: state.pinnedChains,
        }),
      }
    ) as StateCreator<ChainOrderState, [], [], ChainOrderState>,
    Object.is
  )
