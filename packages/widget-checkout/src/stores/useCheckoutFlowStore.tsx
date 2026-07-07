import type { OnRampAccessToken } from '@lifi/widget-provider/checkout'
import {
  createContext,
  type JSX,
  type PropsWithChildren,
  useContext,
  useRef,
} from 'react'
import type { StoreApi, UseBoundStore } from 'zustand'
import { create } from 'zustand'

export type CheckoutFundingSource = 'wallet' | 'transfer' | 'exchange' | 'cash'

export interface CheckoutFlowState {
  fundingSource: CheckoutFundingSource | null
  frozenRouteId: string | null
  /** Exchange account chosen for one-tap reconnect; in-memory, passed to the provider's `open()`. */
  selectedExchangeAccount: OnRampAccessToken | null
  setFundingSource: (source: CheckoutFundingSource | null) => void
  setFrozenRouteId: (routeId: string | null) => void
  setSelectedExchangeAccount: (account: OnRampAccessToken | null) => void
  reset: () => void
}

export type CheckoutFlowStore = UseBoundStore<StoreApi<CheckoutFlowState>>

export function createCheckoutFlowStore(): CheckoutFlowStore {
  return create<CheckoutFlowState>((set) => ({
    fundingSource: null,
    frozenRouteId: null,
    selectedExchangeAccount: null,
    setFundingSource: (fundingSource) => set({ fundingSource }),
    setFrozenRouteId: (frozenRouteId) => set({ frozenRouteId }),
    setSelectedExchangeAccount: (selectedExchangeAccount) =>
      set({ selectedExchangeAccount }),
    reset: () =>
      set({
        fundingSource: null,
        frozenRouteId: null,
        selectedExchangeAccount: null,
      }),
  }))
}

export const CheckoutFlowStoreContext: React.Context<CheckoutFlowStore | null> =
  createContext<CheckoutFlowStore | null>(null)

export function CheckoutFlowStoreProvider({
  children,
}: PropsWithChildren): JSX.Element {
  const storeRef = useRef<CheckoutFlowStore>(null)
  if (!storeRef.current) {
    storeRef.current = createCheckoutFlowStore()
  }
  return (
    <CheckoutFlowStoreContext.Provider value={storeRef.current}>
      {children}
    </CheckoutFlowStoreContext.Provider>
  )
}

export function useCheckoutFlowStore<T>(
  selector: (state: CheckoutFlowState) => T
): T {
  const store = useContext(CheckoutFlowStoreContext)
  if (!store) {
    throw new Error(
      'useCheckoutFlowStore must be used within CheckoutFlowStoreProvider'
    )
  }
  return store(selector)
}
