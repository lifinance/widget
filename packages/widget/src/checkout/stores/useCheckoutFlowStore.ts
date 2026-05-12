import type { StoreApi, UseBoundStore } from 'zustand'
import { create } from 'zustand'

export type CheckoutFundingSource = 'wallet' | 'transfer' | 'exchange' | 'cash'

interface CheckoutFlowState {
  fundingSource: CheckoutFundingSource | null
  frozenRouteId: string | null
  setFundingSource: (source: CheckoutFundingSource | null) => void
  setFrozenRouteId: (routeId: string | null) => void
  reset: () => void
}

export const useCheckoutFlowStore: UseBoundStore<StoreApi<CheckoutFlowState>> =
  create<CheckoutFlowState>((set) => ({
    fundingSource: null,
    frozenRouteId: null,
    setFundingSource: (fundingSource) => set({ fundingSource }),
    setFrozenRouteId: (frozenRouteId) => set({ frozenRouteId }),
    reset: () => set({ fundingSource: null, frozenRouteId: null }),
  }))
