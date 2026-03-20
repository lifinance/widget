import { createContext, useContext } from 'react'

export interface CheckoutDrawerContextValue {
  closeDrawer: () => void
}

export const CheckoutDrawerContext =
  createContext<CheckoutDrawerContextValue | null>(null)

export const useCheckoutDrawer = (): CheckoutDrawerContextValue | null => {
  return useContext(CheckoutDrawerContext)
}
