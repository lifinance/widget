// @vitest-environment happy-dom
import { act, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import {
  CheckoutFlowStoreProvider,
  useCheckoutFlowStore,
} from '../stores/useCheckoutFlowStore.js'
import { useFundingOrderStore } from '../stores/useFundingOrderStore.js'
import { useAbandonCheckout } from './useAbandonCheckout.js'

function resetStore(): void {
  useFundingOrderStore.getState().clearAll()
}

const wrapper = ({ children }: { children: ReactNode }) => (
  <CheckoutFlowStoreProvider>{children}</CheckoutFlowStoreProvider>
)

function useHarness() {
  return {
    abandon: useAbandonCheckout(),
    fundingSource: useCheckoutFlowStore((s) => s.fundingSource),
    setFundingSource: useCheckoutFlowStore((s) => s.setFundingSource),
  }
}

describe('useAbandonCheckout', () => {
  beforeEach(resetStore)
  afterEach(resetStore)

  it('acknowledges the order and resets flow state', () => {
    useFundingOrderStore.getState().track({
      orderId: 'order-1',
      fundingSource: 'transfer',
      createdAt: Date.now(),
    })

    const { result } = renderHook(useHarness, { wrapper })
    act(() => {
      result.current.setFundingSource('transfer')
    })

    expect(useFundingOrderStore.getState().orders['order-1']).toBeDefined()

    act(() => {
      result.current.abandon('order-1')
    })

    expect(useFundingOrderStore.getState().orders['order-1']).toBeUndefined()
    expect(result.current.fundingSource).toBeNull()
  })

  it('resets local state even without an orderId', () => {
    const { result } = renderHook(useHarness, { wrapper })
    act(() => {
      result.current.setFundingSource('wallet')
    })

    act(() => {
      result.current.abandon()
    })

    expect(result.current.fundingSource).toBeNull()
  })

  it('leaves other tracked orders untouched', () => {
    useFundingOrderStore.getState().track({
      orderId: 'order-1',
      fundingSource: 'transfer',
      createdAt: Date.now(),
    })
    useFundingOrderStore.getState().track({
      orderId: 'order-2',
      fundingSource: 'wallet',
      createdAt: Date.now(),
    })

    const { result } = renderHook(useHarness, { wrapper })
    act(() => {
      result.current.abandon('order-1')
    })

    expect(useFundingOrderStore.getState().orders['order-1']).toBeUndefined()
    expect(useFundingOrderStore.getState().orders['order-2']).toBeDefined()
  })
})
