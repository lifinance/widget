// @vitest-environment happy-dom
import { CheckoutContext } from '@lifi/widget-provider/checkout'
import { renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import {
  CheckoutFlowStoreContext,
  createCheckoutFlowStore,
} from '../stores/useCheckoutFlowStore.js'
import { useFundingOrderStore } from '../stores/useFundingOrderStore.js'
import { useFundingOrderCompletion } from './useFundingOrderCompletion.js'

const order = (
  orderId: string,
  status: 'PENDING' | 'DONE' | 'FAILED',
  substatus?: string
) =>
  ({
    orderId,
    partnerOrderId: 'p',
    type: 'SMART_DEPOSIT',
    status,
    substatus,
    destination: { toChainId: 8453, toTokenAddress: '0xT', toAddress: '0xA' },
    result: { toTxHash: '0xdest', toAmount: '990' },
    depositAddress: '0xdeposit',
    createdAt: '',
    updatedAt: '',
  }) as any

function wrap(onSuccess: () => void, onError: () => void) {
  const flowStore = createCheckoutFlowStore()
  flowStore.getState().setFundingSource('transfer')
  return ({ children }: { children: ReactNode }) => (
    <CheckoutContext.Provider value={{ integrator: 'int', onSuccess, onError }}>
      <CheckoutFlowStoreContext.Provider value={flowStore}>
        {children}
      </CheckoutFlowStoreContext.Provider>
    </CheckoutContext.Provider>
  )
}

describe('useFundingOrderCompletion', () => {
  it('fires onSuccess exactly once for a DONE order', () => {
    const onSuccess = vi.fn()
    const onError = vi.fn()
    const { rerender } = renderHook(({ o }) => useFundingOrderCompletion(o), {
      wrapper: wrap(onSuccess, onError),
      initialProps: { o: order('o-done', 'DONE') },
    })
    rerender({ o: order('o-done', 'DONE') })
    expect(onSuccess).toHaveBeenCalledTimes(1)
    expect(onSuccess).toHaveBeenCalledWith({
      provider: 'transfer',
      transactionHash: '0xdest',
      amount: '990',
      token: '0xT',
      chainId: 8453,
      depositAddress: '0xdeposit',
    })
    expect(onError).not.toHaveBeenCalled()
  })

  it('fires onError once with the substatus code for a FAILED order', () => {
    const onSuccess = vi.fn()
    const onError = vi.fn()
    const { rerender } = renderHook(({ o }) => useFundingOrderCompletion(o), {
      wrapper: wrap(onSuccess, onError),
      initialProps: { o: order('o-failed', 'FAILED', 'ONRAMP_REFUNDED') },
    })
    rerender({ o: order('o-failed', 'FAILED', 'ONRAMP_REFUNDED') })
    expect(onError).toHaveBeenCalledTimes(1)
    expect(onError).toHaveBeenCalledWith(
      expect.objectContaining({
        code: 'ONRAMP_REFUNDED',
        message: expect.stringContaining('o-failed'),
        provider: 'transfer',
      })
    )
    expect(onSuccess).not.toHaveBeenCalled()
  })

  it('does nothing for a PENDING order', () => {
    const onSuccess = vi.fn()
    const onError = vi.fn()
    renderHook(() => useFundingOrderCompletion(order('o-pending', 'PENDING')), {
      wrapper: wrap(onSuccess, onError),
    })
    expect(onSuccess).not.toHaveBeenCalled()
    expect(onError).not.toHaveBeenCalled()
  })

  it('fires onSuccess once when order transitions from PENDING to DONE', () => {
    const onSuccess = vi.fn()
    const onError = vi.fn()
    const { rerender } = renderHook(({ o }) => useFundingOrderCompletion(o), {
      wrapper: wrap(onSuccess, onError),
      initialProps: { o: order('o-transition', 'PENDING') },
    })
    expect(onSuccess).not.toHaveBeenCalled()
    rerender({ o: order('o-transition', 'DONE') })
    expect(onSuccess).toHaveBeenCalledTimes(1)
    expect(onSuccess).toHaveBeenCalledWith({
      provider: 'transfer',
      transactionHash: '0xdest',
      amount: '990',
      token: '0xT',
      chainId: 8453,
      depositAddress: '0xdeposit',
    })
    expect(onError).not.toHaveBeenCalled()
  })

  it('does not fire onSuccess again after remount with same orderId', () => {
    const onSuccess = vi.fn()
    const onError = vi.fn()

    // First render with DONE order
    const { unmount } = renderHook(
      () => useFundingOrderCompletion(order('o-remount', 'DONE')),
      {
        wrapper: wrap(onSuccess, onError),
      }
    )
    expect(onSuccess).toHaveBeenCalledTimes(1)

    // Unmount the hook
    unmount()

    // Render a fresh hook instance with the same DONE order
    renderHook(() => useFundingOrderCompletion(order('o-remount', 'DONE')), {
      wrapper: wrap(onSuccess, onError),
    })

    // onSuccess should still be called only once overall (not twice)
    expect(onSuccess).toHaveBeenCalledTimes(1)
    expect(onError).not.toHaveBeenCalled()
  })

  it('records the fired order in the persisted store', () => {
    renderHook(() => useFundingOrderCompletion(order('o-persisted', 'DONE')), {
      wrapper: wrap(vi.fn(), vi.fn()),
    })
    expect(useFundingOrderStore.getState().completed['o-persisted']).toEqual(
      expect.any(Number)
    )
  })

  // A terminal order stays tracked until something acknowledges it, and the
  // wallet flow never acknowledges — so on the next page load the layout
  // observer re-reads a DONE order with an empty in-memory guard.
  it('does not fire again for an order completed in a previous session', () => {
    const onSuccess = vi.fn()
    const onError = vi.fn()
    useFundingOrderStore.setState({
      completed: { 'o-prev-session': Date.now() },
    })

    renderHook(
      () => useFundingOrderCompletion(order('o-prev-session', 'DONE')),
      { wrapper: wrap(onSuccess, onError) }
    )

    expect(onSuccess).not.toHaveBeenCalled()
    expect(onError).not.toHaveBeenCalled()
  })
})
