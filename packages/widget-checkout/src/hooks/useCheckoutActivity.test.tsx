// @vitest-environment happy-dom
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@lifi/sdk', async (importOriginal) => ({
  ...(await importOriginal<object>()),
  getFundingOrder: vi.fn(),
}))
vi.mock('@lifi/widget/shared', () => ({
  useSDKClient: () => ({ config: {} }),
}))

import { getFundingOrder } from '@lifi/sdk'
import { useFundingOrderStore } from '../stores/useFundingOrderStore.js'
import { useCheckoutActivity } from './useCheckoutActivity.js'

const order = (orderId: string, status: 'PENDING' | 'DONE' | 'FAILED') => ({
  orderId,
  partnerOrderId: `p-${orderId}`,
  type: 'SMART_DEPOSIT' as const,
  status,
  destination: { toChainId: 8453, toTokenAddress: '0x1', toAddress: '0x2' },
  createdAt: '',
  updatedAt: '',
})

function wrap({ children }: { children: ReactNode }) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}

beforeEach(() => {
  vi.clearAllMocks()
  useFundingOrderStore.getState().clearAll()
})

describe('useCheckoutActivity', () => {
  it('fans out a poller per tracked order and resolves each phase', async () => {
    useFundingOrderStore.getState().track({
      orderId: 'o-1',
      fundingSource: 'transfer',
      createdAt: Date.now() - 1,
    })
    useFundingOrderStore.getState().track({
      orderId: 'o-2',
      fundingSource: 'wallet',
      createdAt: Date.now(),
    })
    vi.mocked(getFundingOrder).mockImplementation(
      (_client, orderId) =>
        Promise.resolve(
          order(orderId as string, orderId === 'o-1' ? 'DONE' : 'FAILED')
        ) as any
    )

    const { result } = renderHook(() => useCheckoutActivity(), {
      wrapper: wrap,
    })

    await waitFor(() =>
      expect(result.current.every((item) => item.order)).toBe(true)
    )

    // Newest tracked order first (matches `listTrackedOrders`).
    expect(result.current.map((item) => item.orderId)).toEqual(['o-2', 'o-1'])
    expect(result.current.map((item) => item.fundingSource)).toEqual([
      'wallet',
      'transfer',
    ])
    expect(result.current.find((item) => item.orderId === 'o-1')?.phase).toBe(
      'done'
    )
    expect(result.current.find((item) => item.orderId === 'o-2')?.phase).toBe(
      'failed'
    )
  })

  it('returns an empty list with no tracked orders', () => {
    const { result } = renderHook(() => useCheckoutActivity(), {
      wrapper: wrap,
    })
    expect(result.current).toEqual([])
    expect(vi.mocked(getFundingOrder)).not.toHaveBeenCalled()
  })

  it('reports phase undefined before the order resolves', () => {
    useFundingOrderStore.getState().track({
      orderId: 'o-1',
      fundingSource: 'cash',
      createdAt: Date.now(),
    })
    vi.mocked(getFundingOrder).mockReturnValue(new Promise(() => {}))
    const { result } = renderHook(() => useCheckoutActivity(), {
      wrapper: wrap,
    })
    expect(result.current[0]?.order).toBeUndefined()
    expect(result.current[0]?.phase).toBeUndefined()
  })
})
