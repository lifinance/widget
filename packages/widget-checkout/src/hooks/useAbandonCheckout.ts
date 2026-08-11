'use client'
import { useCallback, useContext } from 'react'
import { CheckoutFlowStoreContext } from '../stores/useCheckoutFlowStore.js'
import { useFundingOrderStore } from '../stores/useFundingOrderStore.js'
import { FrozenQuoteStoreContext } from './useFrozenQuote.js'

// `orderId` is only known once a flow has created its funding order (e.g. the
// transfer-deposit page's QR code) — callers without one just reset local state.
export function useAbandonCheckout(): (orderId?: string) => void {
  const flowStore = useContext(CheckoutFlowStoreContext)
  const frozenStore = useContext(FrozenQuoteStoreContext)
  const acknowledge = useFundingOrderStore((s) => s.acknowledge)

  return useCallback(
    (orderId?: string) => {
      if (orderId) {
        acknowledge(orderId)
      }
      frozenStore?.getState().set(null)
      flowStore?.getState().reset()
    },
    [flowStore, frozenStore, acknowledge]
  )
}
