'use client'
import { create, type StoreApi, type UseBoundStore } from 'zustand'

export type CheckoutToastKey = 'resumeNotFound'

interface CheckoutToastState {
  toast: CheckoutToastKey | null
  show: (toast: CheckoutToastKey) => void
  dismiss: () => void
}

// Module-level so toasts survive in-app navigation.
export const useCheckoutToastStore: UseBoundStore<
  StoreApi<CheckoutToastState>
> = create<CheckoutToastState>((set) => ({
  toast: null,
  show: (toast) => set({ toast }),
  dismiss: () => set({ toast: null }),
}))
