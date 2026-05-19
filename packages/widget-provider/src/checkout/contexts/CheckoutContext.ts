'use client'
import { type Context, createContext, useContext } from 'react'
import type { CheckoutContextValue } from '../types.js'

export const CheckoutContext: Context<CheckoutContextValue | null> =
  createContext<CheckoutContextValue | null>(null)

/**
 * Reads the runtime checkout config (integrator, callbacks, session API
 * base URL) on-ramp host components depend on. Throws when called outside
 * the widget's `CheckoutProvider`.
 */
export function useCheckoutConfig(): CheckoutContextValue {
  const ctx = useContext(CheckoutContext)
  if (!ctx) {
    throw new Error('useCheckoutConfig must be used within CheckoutProvider')
  }
  return ctx
}
