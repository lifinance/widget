// @vitest-environment happy-dom
import { act, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const navigateMock = vi.fn()
vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => navigateMock,
}))

import {
  CheckoutFlowStoreProvider,
  useCheckoutFlowStore,
} from '../stores/useCheckoutFlowStore.js'
import type { ActivityItem } from './useCheckoutActivity.js'
import { useResumeCheckout } from './useResumeCheckout.js'

function wrapper({ children }: { children: ReactNode }) {
  return <CheckoutFlowStoreProvider>{children}</CheckoutFlowStoreProvider>
}

function useHarness() {
  return {
    resume: useResumeCheckout(),
    fundingSource: useCheckoutFlowStore((s) => s.fundingSource),
  }
}

function item(overrides: Partial<ActivityItem> = {}): ActivityItem {
  return {
    orderId: 'order-1',
    fundingSource: 'transfer',
    order: undefined,
    phase: 'pending',
    createdAt: Date.now(),
    ...overrides,
  }
}

beforeEach(() => {
  navigateMock.mockReset()
})

describe('useResumeCheckout', () => {
  it('reopens the deposit QR for a transfer order still awaiting funds', () => {
    const { result } = renderHook(useHarness, { wrapper })
    act(() => {
      result.current.resume(
        item({
          fundingSource: 'transfer',
          order: { substatus: 'INTENT_AWAITING_FUNDS' } as never,
        })
      )
    })
    expect(navigateMock).toHaveBeenCalledWith({
      to: '/transfer-deposit',
      search: { orderId: 'order-1' },
    })
  })

  it('sends a transfer order past INTENT_AWAITING_FUNDS to the status route', () => {
    const { result } = renderHook(useHarness, { wrapper })
    act(() => {
      result.current.resume(
        item({
          fundingSource: 'transfer',
          order: { substatus: 'DEPOSIT_RECEIVED' } as never,
        })
      )
    })
    expect(navigateMock).toHaveBeenCalledWith({
      to: '/transaction-execution/transaction-status',
      search: { orderId: 'order-1' },
    })
  })

  it('sends a wallet order to the status route (no local route re-attach)', () => {
    const { result } = renderHook(useHarness, { wrapper })
    act(() => {
      result.current.resume(item({ fundingSource: 'wallet', order: undefined }))
    })
    expect(navigateMock).toHaveBeenCalledWith({
      to: '/transaction-execution/transaction-status',
      search: { orderId: 'order-1' },
    })
  })

  it('sends a transfer order with no order data yet to the status route', () => {
    const { result } = renderHook(useHarness, { wrapper })
    act(() => {
      result.current.resume(
        item({ fundingSource: 'transfer', order: undefined, phase: undefined })
      )
    })
    expect(navigateMock).toHaveBeenCalledWith({
      to: '/transaction-execution/transaction-status',
      search: { orderId: 'order-1' },
    })
  })

  it('sets fundingSource on the flow store before navigating', () => {
    const { result } = renderHook(useHarness, { wrapper })
    expect(result.current.fundingSource).toBeNull()
    act(() => {
      result.current.resume(item({ fundingSource: 'exchange' }))
    })
    expect(result.current.fundingSource).toBe('exchange')
  })
})
