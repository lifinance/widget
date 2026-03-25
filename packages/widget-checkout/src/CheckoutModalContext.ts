import { createContext, useContext } from 'react'

export interface CheckoutModalContextValue {
  closeModal: () => void
}

export const CheckoutModalContext =
  createContext<CheckoutModalContextValue | null>(null)

export const useCheckoutModal = (): CheckoutModalContextValue | null => {
  return useContext(CheckoutModalContext)
}
