// @vitest-environment happy-dom
import { CheckoutContext } from '@lifi/widget-provider/checkout'
import { renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import {
  CheckoutFlowStoreContext,
  createCheckoutFlowStore,
} from '../stores/useCheckoutFlowStore.js'
import { useFundingOrderCompletion } from './useFundingOrderCompletion.js'

const order = (status: 'PENDING' | 'DONE' | 'FAILED', substatus?: string) =>
  ({
    orderId: 'o-1',
    partnerOrderId: 'p',
    type: 'SMART_DEPOSIT',
    status,
    substatus,
    destination: { toChainId: 8453, toTokenAddress: '0xT', toAddress: '0xA' },
    result: { toTxHash: '0xdest', toAmount: '990' },
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
      initialProps: { o: order('DONE') },
    })
    rerender({ o: order('DONE') })
    expect(onSuccess).toHaveBeenCalledTimes(1)
    expect(onSuccess).toHaveBeenCalledWith(
      expect.objectContaining({
        provider: 'transfer',
        transactionHash: '0xdest',
        amount: '990',
        chainId: 8453,
      })
    )
    expect(onError).not.toHaveBeenCalled()
  })

  it('fires onError once with the substatus code for a FAILED order', () => {
    const onSuccess = vi.fn()
    const onError = vi.fn()
    const { rerender } = renderHook(({ o }) => useFundingOrderCompletion(o), {
      wrapper: wrap(onSuccess, onError),
      initialProps: { o: order('FAILED', 'ONRAMP_REFUNDED') },
    })
    rerender({ o: order('FAILED', 'ONRAMP_REFUNDED') })
    expect(onError).toHaveBeenCalledTimes(1)
    expect(onError).toHaveBeenCalledWith(
      expect.objectContaining({ code: 'ONRAMP_REFUNDED' })
    )
    expect(onSuccess).not.toHaveBeenCalled()
  })

  it('does nothing for a PENDING order', () => {
    const onSuccess = vi.fn()
    const onError = vi.fn()
    renderHook(() => useFundingOrderCompletion(order('PENDING')), {
      wrapper: wrap(onSuccess, onError),
    })
    expect(onSuccess).not.toHaveBeenCalled()
    expect(onError).not.toHaveBeenCalled()
  })
})
