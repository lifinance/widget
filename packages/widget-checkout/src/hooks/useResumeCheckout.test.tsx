// @vitest-environment happy-dom
import { act, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const navigateMock = vi.fn()
vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => navigateMock,
}))

const setExecutableRouteMock = vi.fn()
vi.mock('@lifi/widget/shared', () => ({
  // navigationRoutes feeds utils/navigationRoutes.ts at module scope.
  navigationRoutes: { transactionExecution: 'transaction-execution' },
  useRouteExecutionStoreContext: () => ({
    getState: () => ({ setExecutableRoute: setExecutableRouteMock }),
  }),
}))

vi.mock('@lifi/sdk', async (importOriginal) => ({
  ...(await importOriginal<object>()),
  convertOrderToRoute: vi.fn(),
}))

import type { FundingOrder, Route } from '@lifi/sdk'
import { convertOrderToRoute } from '@lifi/sdk'
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

function walletOrder(overrides: Partial<FundingOrder> = {}): FundingOrder {
  return {
    orderId: 'order-1',
    partnerOrderId: 'p-1',
    type: 'STANDARD',
    // A fresh STANDARD order carries PENDING with no substatus.
    status: 'PENDING',
    destination: { toChainId: 8453, toTokenAddress: '0x1', toAddress: '0x2' },
    createdAt: '',
    updatedAt: '',
    ...overrides,
  } as FundingOrder
}

beforeEach(() => {
  navigateMock.mockReset()
  setExecutableRouteMock.mockReset()
  vi.mocked(convertOrderToRoute).mockReset()
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

  it('sends a wallet order with no order data yet to the status route', () => {
    const { result } = renderHook(useHarness, { wrapper })
    act(() => {
      result.current.resume(item({ fundingSource: 'wallet', order: undefined }))
    })
    expect(navigateMock).toHaveBeenCalledWith({
      to: '/transaction-execution/transaction-status',
      search: { orderId: 'order-1' },
    })
    expect(setExecutableRouteMock).not.toHaveBeenCalled()
  })

  it('reopens the review page for an unsent wallet order so it can be paid again', () => {
    const orderRoute = { id: 'order-1' } as unknown as Route
    vi.mocked(convertOrderToRoute).mockReturnValue(orderRoute)
    const { result } = renderHook(useHarness, { wrapper })
    act(() => {
      result.current.resume(
        item({ fundingSource: 'wallet', order: walletOrder() })
      )
    })
    expect(setExecutableRouteMock).toHaveBeenCalledWith(orderRoute)
    expect(navigateMock).toHaveBeenCalledWith({
      to: '/transaction-execution',
      search: { routeId: 'order-1' },
    })
  })

  it('sends an already-sent wallet order to the status route instead', () => {
    const { result } = renderHook(useHarness, { wrapper })
    act(() => {
      result.current.resume(
        item({
          fundingSource: 'wallet',
          order: walletOrder({ result: { fromTxHash: '0xsent' } }),
        })
      )
    })
    expect(setExecutableRouteMock).not.toHaveBeenCalled()
    expect(navigateMock).toHaveBeenCalledWith({
      to: '/transaction-execution/transaction-status',
      search: { orderId: 'order-1' },
    })
  })

  it('sends a terminal wallet order to the status route', () => {
    const { result } = renderHook(useHarness, { wrapper })
    act(() => {
      result.current.resume(
        item({
          fundingSource: 'wallet',
          phase: 'done',
          order: walletOrder({ status: 'DONE' }),
        })
      )
    })
    expect(setExecutableRouteMock).not.toHaveBeenCalled()
    expect(navigateMock).toHaveBeenCalledWith({
      to: '/transaction-execution/transaction-status',
      search: { orderId: 'order-1' },
    })
  })

  it('falls back to the status route when the order has no executable quote', () => {
    vi.mocked(convertOrderToRoute).mockImplementation(() => {
      throw new Error('no quote')
    })
    const { result } = renderHook(useHarness, { wrapper })
    act(() => {
      result.current.resume(
        item({ fundingSource: 'wallet', order: walletOrder() })
      )
    })
    expect(setExecutableRouteMock).not.toHaveBeenCalled()
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
