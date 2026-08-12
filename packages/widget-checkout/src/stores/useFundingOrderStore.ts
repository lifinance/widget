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
  /** orderId → when its terminal callback fired. */
  completed: Record<string, number>
  track: (order: TrackedFundingOrder) => void
  acknowledge: (orderId: string) => void
  markCompleted: (orderId: string) => void
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

function pruneCompleted(
  completed: Record<string, number>,
  now: number
): Record<string, number> {
  const out: Record<string, number> = {}
  for (const [id, at] of Object.entries(completed)) {
    if (now - at <= FUNDING_ORDER_RETENTION_MS) {
      out[id] = at
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

type SetFundingOrderState = (partial: Partial<FundingOrderState>) => void

let setFundingOrderState: SetFundingOrderState | undefined

export const useFundingOrderStore: UseBoundStore<StoreApi<FundingOrderState>> =
  create<FundingOrderState>()(
    persist(
      (set) => {
        setFundingOrderState = set
        return {
          orders: {},
          completed: {},
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
          markCompleted: (orderId) =>
            set((state) => {
              const now = Date.now()
              return {
                completed: {
                  ...pruneCompleted(state.completed ?? {}, now),
                  [orderId]: now,
                },
              }
            }),
          clearAll: () => set({ orders: {}, completed: {} }),
        }
      },
      {
        name: FUNDING_ORDER_STORAGE_KEY,
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          orders: state.orders,
          completed: state.completed,
        }),
        onRehydrateStorage: () => (rehydrated, error) => {
          if (error || !rehydrated) {
            return
          }
          const now = Date.now()
          const pruned = prune(rehydrated.orders, now)
          if (
            Object.keys(pruned).length !== Object.keys(rehydrated.orders).length
          ) {
            setFundingOrderState?.({ orders: pruned })
          }
          // Persisted before `completed` existed → the key is absent.
          const completed = rehydrated.completed ?? {}
          const prunedCompleted = pruneCompleted(completed, now)
          if (
            Object.keys(prunedCompleted).length !==
            Object.keys(completed).length
          ) {
            setFundingOrderState?.({ completed: prunedCompleted })
          }
        },
        version: 1,
      }
    )
  )
