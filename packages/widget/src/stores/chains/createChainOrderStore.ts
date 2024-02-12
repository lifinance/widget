import type { StateCreator } from 'zustand';
import { persist } from 'zustand/middleware';
import { createWithEqualityFn } from 'zustand/traditional';
import type { PersistStoreProps } from '../types.js';
import type { ChainOrderState } from './types.js';

export const maxChainToOrder = 9;
const defaultChainState = {
  from: [],
  to: [],
};

export const createChainOrderStore = ({ namePrefix }: PersistStoreProps) =>
  createWithEqualityFn<ChainOrderState>(
    persist(
      (set, get) => ({
        chainOrder: defaultChainState,
        availableChains: defaultChainState,
        initializeChains: (chainIds, type) => {
          set((state: ChainOrderState) => {
            const chainOrder = state.chainOrder[type].filter((chainId) =>
              chainIds.includes(chainId),
            );
            const chainsToAdd = chainIds.filter(
              (chainId) => !chainOrder.includes(chainId),
            );
            if (chainOrder.length === maxChainToOrder || !chainsToAdd.length) {
              return {
                availableChains: {
                  ...state.availableChains,
                  [type]: chainIds,
                },
                chainOrder: {
                  ...state.chainOrder,
                  [type]: chainOrder,
                },
              };
            }
            const chainsToAddLength = maxChainToOrder - chainOrder.length;
            for (let index = 0; index < chainsToAddLength; index++) {
              chainOrder.push(chainsToAdd[index]);
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
            };
          });
          return get().chainOrder[type];
        },
        setChain: (chainId, type) => {
          const state = get();
          if (
            state.chainOrder[type].includes(chainId) ||
            !state.availableChains[type].includes(chainId)
          ) {
            return;
          }
          set((state: ChainOrderState) => {
            const chainOrder = state.chainOrder[type].slice();
            chainOrder.unshift(chainId);
            if (chainOrder.length > maxChainToOrder) {
              chainOrder.pop();
            }
            return {
              chainOrder: {
                ...state.chainOrder,
                [type]: chainOrder,
              },
            };
          });
        },
      }),
      {
        name: `${namePrefix || 'li.fi'}-widget-chains-order`,
        version: 1,
        partialize: (state) => ({ chainOrder: state.chainOrder }),
      },
    ) as StateCreator<ChainOrderState, [], [], ChainOrderState>,
    Object.is,
  );
