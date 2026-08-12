// @vitest-environment happy-dom
import { CheckoutContext } from '@lifi/widget-provider/checkout'
import { render } from '@testing-library/react'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { ActivityItem } from '../hooks/useCheckoutActivity.js'
import { useFundingOrderCompletion } from '../hooks/useFundingOrderCompletion.js'
import {
  CheckoutFlowStoreContext,
  createCheckoutFlowStore,
} from '../stores/useCheckoutFlowStore.js'
import { useFundingOrderStore } from '../stores/useFundingOrderStore.js'

const activityMock = vi.fn<() => ActivityItem[]>()
vi.mock('../hooks/useCheckoutActivity.js', () => ({
  useCheckoutActivity: () => activityMock(),
}))

import { CheckoutCompletionObserver } from './CheckoutCompletionObserver.js'

const order = (orderId: string, status: 'PENDING' | 'DONE' | 'FAILED') =>
  ({
    orderId,
    partnerOrderId: 'p',
    type: 'STANDARD',
    status,
    destination: { toChainId: 8453, toTokenAddress: '0xT', toAddress: '0xA' },
    result: { toTxHash: '0xdest', toAmount: '990' },
    depositAddress: '0xdeposit',
    createdAt: '',
    updatedAt: '',
  }) as any

const item = (
  orderId: string,
  status: 'PENDING' | 'DONE' | 'FAILED',
  fundingSource: ActivityItem['fundingSource'] = 'wallet'
): ActivityItem => ({
  orderId,
  fundingSource,
  order: order(orderId, status),
  phase:
    status === 'DONE' ? 'done' : status === 'FAILED' ? 'failed' : 'pending',
  createdAt: 0,
})

// The live flow store says `cash` so a leaked read of it is visible in the
// asserted `provider` field.
function wrap(onSuccess: () => void, onError: () => void) {
  const flowStore = createCheckoutFlowStore()
  flowStore.getState().setFundingSource('cash')
  return ({ children }: { children: ReactNode }) => (
    <CheckoutContext.Provider value={{ integrator: 'int', onSuccess, onError }}>
      <CheckoutFlowStoreContext.Provider value={flowStore}>
        {children}
      </CheckoutFlowStoreContext.Provider>
    </CheckoutContext.Provider>
  )
}

beforeEach(() => {
  activityMock.mockReset()
})

describe('CheckoutCompletionObserver', () => {
  it('fires onSuccess once for a DONE order that no status page is mounted for', () => {
    const onSuccess = vi.fn()
    const onError = vi.fn()
    activityMock.mockReturnValue([item('obs-done', 'DONE')])

    render(<CheckoutCompletionObserver />, {
      wrapper: wrap(onSuccess, onError),
    })

    expect(onSuccess).toHaveBeenCalledTimes(1)
    expect(onSuccess).toHaveBeenCalledWith({
      provider: 'wallet',
      transactionHash: '0xdest',
      amount: '990',
      token: '0xT',
      chainId: 8453,
      depositAddress: '0xdeposit',
    })
    expect(onError).not.toHaveBeenCalled()
  })

  it('does not fire again when a second observer mounts for the same order', () => {
    const onSuccess = vi.fn()
    const onError = vi.fn()
    activityMock.mockReturnValue([item('obs-twice', 'DONE', 'transfer')])

    render(<CheckoutCompletionObserver />, {
      wrapper: wrap(onSuccess, onError),
    })
    render(<CheckoutCompletionObserver />, {
      wrapper: wrap(onSuccess, onError),
    })

    expect(onSuccess).toHaveBeenCalledTimes(1)
  })

  it('does not fire again when the status page hook runs for the same order', () => {
    const onSuccess = vi.fn()
    const onError = vi.fn()
    const done = item('obs-status-page', 'DONE', 'transfer')
    activityMock.mockReturnValue([done])

    render(<CheckoutCompletionObserver />, {
      wrapper: wrap(onSuccess, onError),
    })
    expect(onSuccess).toHaveBeenCalledTimes(1)

    // What CheckoutTransactionStatusPage does with the very same order.
    function StatusPageCall(): null {
      useFundingOrderCompletion(done.order)
      return null
    }
    render(<StatusPageCall />, { wrapper: wrap(onSuccess, onError) })

    expect(onSuccess).toHaveBeenCalledTimes(1)
  })

  // The wallet flow never acknowledges its DONE order, so it stays tracked for
  // the whole retention window and this observer re-reads it on every mount —
  // including after a reload, where the in-memory guard is empty.
  it('stays quiet for an order whose callback already fired in a previous session', () => {
    const onSuccess = vi.fn()
    const onError = vi.fn()
    useFundingOrderStore.setState({
      completed: { 'obs-prev-session': Date.now() },
    })
    activityMock.mockReturnValue([item('obs-prev-session', 'DONE')])

    render(<CheckoutCompletionObserver />, {
      wrapper: wrap(onSuccess, onError),
    })

    expect(onSuccess).not.toHaveBeenCalled()
    expect(onError).not.toHaveBeenCalled()
  })

  it('fires onError for a FAILED order and stays quiet for a PENDING one', () => {
    const onSuccess = vi.fn()
    const onError = vi.fn()
    activityMock.mockReturnValue([
      item('obs-failed', 'FAILED', 'cash'),
      item('obs-pending', 'PENDING', 'exchange'),
    ])

    render(<CheckoutCompletionObserver />, {
      wrapper: wrap(onSuccess, onError),
    })

    expect(onError).toHaveBeenCalledTimes(1)
    expect(onError).toHaveBeenCalledWith(
      expect.objectContaining({
        code: 'ORDER_FAILED',
        provider: 'cash',
      })
    )
    expect(onSuccess).not.toHaveBeenCalled()
  })
})
