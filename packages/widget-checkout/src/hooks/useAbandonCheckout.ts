'use client'
import { CheckoutContext } from '@lifi/widget-provider/checkout'
import { useCallback, useContext } from 'react'
import { CheckoutFlowStoreContext } from '../stores/useCheckoutFlowStore.js'
import {
  buildResumeKey,
  usePendingCheckoutStore,
} from '../stores/usePendingCheckoutStore.js'
import { FrozenQuoteStoreContext } from './useFrozenQuote.js'

export function useAbandonCheckout(): () => void {
  const checkoutContext = useContext(CheckoutContext)
  const flowStore = useContext(CheckoutFlowStoreContext)
  const frozenStore = useContext(FrozenQuoteStoreContext)
  const clearForKey = usePendingCheckoutStore((s) => s.clearForKey)

  return useCallback(() => {
    const integrator = checkoutContext?.integrator
    const depositId = flowStore?.getState().frozenDepositId
    if (integrator && depositId) {
      clearForKey(buildResumeKey(integrator, depositId))
    }
    frozenStore?.getState().set(null)
    flowStore?.getState().reset()
  }, [checkoutContext, flowStore, frozenStore, clearForKey])
}
