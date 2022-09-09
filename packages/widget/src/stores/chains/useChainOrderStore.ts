/* eslint-disable no-underscore-dangle */
import create from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { ChainOrderState, ChainOrderStore } from './types';

export const maxChainToOrder = 9;

export const useChainOrderStore = create<ChainOrderStore>()(
  persist(
    immer((set, get) => ({
      chainOrder: [],
      availableChains: [],
      initializeChains: (chainIds: number[]) => {
        set((state: ChainOrderState) => {
          state.availableChains = chainIds;
          state.chainOrder = state.chainOrder.filter((chainId) =>
            chainIds.includes(chainId),
          );
          const chainsToAdd = chainIds.filter(
            (chainId) => !state.chainOrder.includes(chainId),
          );
          if (
            state.chainOrder.length === maxChainToOrder ||
            !chainsToAdd.length
          ) {
            return;
          }
          const chainsToAddLength = maxChainToOrder - state.chainOrder.length;
          for (let index = 0; index < chainsToAddLength; index++) {
            state.chainOrder.push(chainsToAdd[index]);
          }
        });
        return get().chainOrder;
      },
      setChain: (chainId: number) =>
        set((state: ChainOrderState) => {
          if (
            state.chainOrder.includes(chainId) ||
            !state.availableChains.includes(chainId)
          ) {
            return;
          }
          state.chainOrder.unshift(chainId);
          if (state.chainOrder.length > maxChainToOrder) {
            state.chainOrder.pop();
          }
        }),
    })),
    {
      name: 'li.fi-widget-chains-order',
      version: 0,
      partialize: (state) => ({ chainOrder: state.chainOrder }),
    },
  ),
);
