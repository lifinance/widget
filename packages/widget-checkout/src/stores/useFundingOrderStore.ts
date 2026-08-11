'use client'
import { create, type StoreApi, type UseBoundStore } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { CheckoutFundingSource } from './useCheckoutFlowStore.js'

export const FUNDING_ORDER_STORAGE_KEY = 'lifi-checkout-orders'
export const FUNDING_ORDER_RETENTION_MS: number = 7 * 24 * 60 * 60 * 1000

export interface TrackedFundingOrder {
  orderId: string
  fundingSource: CheckoutFundingSource
  createdAt: number
}

interface FundingOrderState {
  orders: Record<string, TrackedFundingOrder>
  track: (order: TrackedFundingOrder) => void
  acknowledge: (orderId: string) => void
  clearAll: () => void
}

function prune(
  orders: Record<string, TrackedFundingOrder>,
  now: number
): Record<string, TrackedFundingOrder> {
  const out: Record<string, TrackedFundingOrder> = {}
  for (const [id, order] of Object.entries(orders)) {
    if (now - order.createdAt <= FUNDING_ORDER_RETENTION_MS) {
      out[id] = order
    }
  }
  return out
}

export function listTrackedOrders(
  orders: Record<string, TrackedFundingOrder>,
  now: number
): TrackedFundingOrder[] {
  return Object.values(prune(orders, now)).sort(
    (a, b) => b.createdAt - a.createdAt
  )
}

export const useFundingOrderStore: UseBoundStore<StoreApi<FundingOrderState>> =
  create<FundingOrderState>()(
    persist(
      (set) => ({
        orders: {},
        track: (order) =>
          set((state) => ({
            orders: {
              ...prune(state.orders, Date.now()),
              [order.orderId]: order,
            },
          })),
        acknowledge: (orderId) =>
          set((state) => {
            if (!(orderId in state.orders)) {
              return state
            }
            const { [orderId]: _removed, ...rest } = state.orders
            return { orders: rest }
          }),
        clearAll: () => set({ orders: {} }),
      }),
      {
        name: FUNDING_ORDER_STORAGE_KEY,
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({ orders: state.orders }),
        onRehydrateStorage: () => (rehydrated, error) => {
          if (error || !rehydrated) {
            return
          }
          const pruned = prune(rehydrated.orders, Date.now())
          if (
            Object.keys(pruned).length !== Object.keys(rehydrated.orders).length
          ) {
            useFundingOrderStore.setState({ orders: pruned })
          }
        },
        version: 1,
      }
    )
  )
