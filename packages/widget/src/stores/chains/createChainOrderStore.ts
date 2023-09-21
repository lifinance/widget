import type { StateCreator } from 'zustand';
import { persist } from 'zustand/middleware';
import { createWithEqualityFn } from 'zustand/traditional';
import type { PersistStoreProps } from '../types';
import type { ChainOrderState } from './types';

export const maxChainToOrder = 9;

export const createChainOrderStore = ({ namePrefix }: PersistStoreProps) =>
  createWithEqualityFn<ChainOrderState>(
    persist(
      (set, get) => ({
        chainOrder: [],
        availableChains: [],
        initializeChains: (chainIds: number[]) => {
          set((state: ChainOrderState) => {
            const chainOrder = state.chainOrder.filter((chainId) =>
              chainIds.includes(chainId),
            );
            const chainsToAdd = chainIds.filter(
              (chainId) => !chainOrder.includes(chainId),
            );
            if (chainOrder.length === maxChainToOrder || !chainsToAdd.length) {
              return {
                availableChains: chainIds,
                chainOrder,
              };
            }
            const chainsToAddLength = maxChainToOrder - chainOrder.length;
            for (let index = 0; index < chainsToAddLength; index++) {
              chainOrder.push(chainsToAdd[index]);
            }
            return {
              availableChains: chainIds,
              chainOrder,
            };
          });
          return get().chainOrder;
        },
        setChain: (chainId: number) => {
          const state = get();
          if (
            state.chainOrder.includes(chainId) ||
            !state.availableChains.includes(chainId)
          ) {
            return;
          }
          set((state: ChainOrderState) => {
            const chainOrder = state.chainOrder.slice();
            chainOrder.unshift(chainId);
            if (chainOrder.length > maxChainToOrder) {
              chainOrder.pop();
            }
            return {
              chainOrder,
            };
          });
        },
      }),
      {
        name: `${namePrefix || 'li.fi'}-widget-chains-order`,
        version: 0,
        partialize: (state) => ({ chainOrder: state.chainOrder }),
      },
    ) as StateCreator<ChainOrderState, [], [], ChainOrderState>,
    Object.is,
  );
