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
import {
  ORDER_POLLING_INTERVAL_MS,
  orderRefetchInterval,
  useFundingOrder,
} from './useFundingOrder.js'

const order = (status: 'PENDING' | 'DONE' | 'FAILED') => ({
  orderId: 'o-1',
  partnerOrderId: 'p-1',
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
})

describe('useFundingOrder', () => {
  it('resolves the order and derives the phase', async () => {
    vi.mocked(getFundingOrder).mockResolvedValue(order('DONE') as any)
    const { result } = renderHook(() => useFundingOrder('o-1'), {
      wrapper: wrap,
    })
    await waitFor(() => expect(result.current.order).toBeDefined())
    expect(result.current.phase).toBe('done')
  })

  it('is disabled with a null orderId', () => {
    const { result } = renderHook(() => useFundingOrder(null), {
      wrapper: wrap,
    })
    expect(result.current.order).toBeUndefined()
    expect(vi.mocked(getFundingOrder)).not.toHaveBeenCalled()
  })

  it('maps FAILED to the failed phase', async () => {
    vi.mocked(getFundingOrder).mockResolvedValue(order('FAILED') as any)
    const { result } = renderHook(() => useFundingOrder('o-1'), {
      wrapper: wrap,
    })
    await waitFor(() => expect(result.current.phase).toBe('failed'))
  })

  it('maps PENDING to the pending phase', async () => {
    vi.mocked(getFundingOrder).mockResolvedValue(order('PENDING') as any)
    const { result } = renderHook(() => useFundingOrder('o-1'), {
      wrapper: wrap,
    })
    await waitFor(() => expect(result.current.phase).toBe('pending'))
  })
})

describe('orderRefetchInterval', () => {
  it('stops on terminal statuses', () => {
    expect(orderRefetchInterval('DONE')).toBe(false)
    expect(orderRefetchInterval('FAILED')).toBe(false)
  })

  it('polls at the 10s floor otherwise', () => {
    expect(orderRefetchInterval('PENDING')).toBe(ORDER_POLLING_INTERVAL_MS)
    expect(orderRefetchInterval(undefined)).toBe(ORDER_POLLING_INTERVAL_MS)
  })
})
