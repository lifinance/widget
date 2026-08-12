// @vitest-environment happy-dom

import {
  createOnRampSessionsStore,
  type OnRampSession,
  OnRampSessionsContext,
  type OnRampSessionsStore,
} from '@lifi/widget-provider/checkout'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@lifi/wallet-management', () => ({
  useAccount: () => ({ accounts: [] }),
}))
vi.mock('@lifi/widget/shared', () => ({
  useSDKClient: () => ({ config: {} }),
}))
vi.mock('@lifi/sdk', async (importOriginal) => ({
  ...(await importOriginal<object>()),
  getFundingOrder: vi.fn(),
}))

import { getFundingOrder } from '@lifi/sdk'
import { useFundingOrderStore } from '../stores/useFundingOrderStore.js'
import { useIsCheckoutBusy } from './useIsCheckoutBusy.js'

function makeSession(isOpen: boolean): OnRampSession {
  return {
    isOpen,
    isLoading: false,
    error: null,
    failure: null,
    depositTxHash: null,
    open: () => {},
    close: () => {},
    acknowledgeDepositTxHash: () => {},
    mountTargetId: null,
  } as unknown as OnRampSession
}

function order(
  orderId: string,
  status: 'PENDING' | 'DONE' | 'FAILED',
  substatus?: string
) {
  return {
    orderId,
    partnerOrderId: `p-${orderId}`,
    type: 'SMART_DEPOSIT' as const,
    status,
    substatus,
    destination: { toChainId: 8453, toTokenAddress: '0x1', toAddress: '0x2' },
    createdAt: '',
    updatedAt: '',
  }
}

function wrap(store: OnRampSessionsStore | null, client: QueryClient) {
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>
      {store ? (
        <OnRampSessionsContext.Provider value={store}>
          {children}
        </OnRampSessionsContext.Provider>
      ) : (
        children
      )}
    </QueryClientProvider>
  )
}

beforeEach(() => {
  vi.clearAllMocks()
  useFundingOrderStore.getState().clearAll()
})

describe('useIsCheckoutBusy', () => {
  it('returns false when no provider is mounted', () => {
    const { result } = renderHook(() => useIsCheckoutBusy(), {
      wrapper: wrap(null, new QueryClient()),
    })
    expect(result.current).toBe(false)
  })

  it('returns false when sessions are empty', () => {
    const store = createOnRampSessionsStore()
    const { result } = renderHook(() => useIsCheckoutBusy(), {
      wrapper: wrap(store, new QueryClient()),
    })
    expect(result.current).toBe(false)
  })

  it('returns false when the only session is closed', () => {
    const store = createOnRampSessionsStore()
    store.getState().register('s1', makeSession(false))
    const { result } = renderHook(() => useIsCheckoutBusy(), {
      wrapper: wrap(store, new QueryClient()),
    })
    expect(result.current).toBe(false)
  })

  it('returns true when at least one session is open', () => {
    const store = createOnRampSessionsStore()
    store.getState().register('s1', makeSession(true))
    const { result } = renderHook(() => useIsCheckoutBusy(), {
      wrapper: wrap(store, new QueryClient()),
    })
    expect(result.current).toBe(true)
  })

  it('returns true when one of two sessions is open', () => {
    const store = createOnRampSessionsStore()
    store.getState().register('s1', makeSession(false))
    store.getState().register('s2', makeSession(true))
    const { result } = renderHook(() => useIsCheckoutBusy(), {
      wrapper: wrap(store, new QueryClient()),
    })
    expect(result.current).toBe(true)
  })

  it('reacts to session updates', () => {
    const store = createOnRampSessionsStore()
    store.getState().register('s1', makeSession(false))
    const { result } = renderHook(() => useIsCheckoutBusy(), {
      wrapper: wrap(store, new QueryClient()),
    })
    expect(result.current).toBe(false)
    act(() => {
      store.getState().register('s1', makeSession(true))
    })
    expect(result.current).toBe(true)
  })
})

describe('useIsCheckoutBusy — tracked-order (post-payment) gate', () => {
  it('is busy with a live-pending tracked order even when all sessions are closed', async () => {
    const store = createOnRampSessionsStore()
    store.getState().register('s1', makeSession(false))
    useFundingOrderStore.getState().track({
      orderId: 'o-1',
      fundingSource: 'cash',
      createdAt: Date.now(),
    })
    vi.mocked(getFundingOrder).mockResolvedValue(order('o-1', 'PENDING') as any)
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })
    const { result } = renderHook(() => useIsCheckoutBusy(), {
      wrapper: wrap(store, client),
    })
    await waitFor(() =>
      expect(client.getQueryData(['funding-order', 'o-1'])).toBeDefined()
    )
    expect(result.current).toBe(true)
  })

  it('is not busy while the tracked order has not resolved its first poll (unlike terminal states, unknown is not treated as busy)', () => {
    const store = createOnRampSessionsStore()
    useFundingOrderStore.getState().track({
      orderId: 'o-1',
      fundingSource: 'cash',
      createdAt: Date.now(),
    })
    vi.mocked(getFundingOrder).mockReturnValue(new Promise(() => {}))
    const { result } = renderHook(() => useIsCheckoutBusy(), {
      wrapper: wrap(store, new QueryClient()),
    })
    expect(result.current).toBe(false)
  })

  it('is not busy once the tracked order resolves to a terminal phase', async () => {
    const store = createOnRampSessionsStore()
    useFundingOrderStore.getState().track({
      orderId: 'o-1',
      fundingSource: 'cash',
      createdAt: Date.now(),
    })
    vi.mocked(getFundingOrder).mockResolvedValue(order('o-1', 'DONE') as any)
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })
    const { result } = renderHook(() => useIsCheckoutBusy(), {
      wrapper: wrap(store, client),
    })
    await waitFor(() =>
      expect(client.getQueryData(['funding-order', 'o-1'])).toBeDefined()
    )
    expect(result.current).toBe(false)
  })

  it('is not busy with a tracked order that was created but never funded (INTENT_AWAITING_FUNDS), even days later', async () => {
    const store = createOnRampSessionsStore()
    useFundingOrderStore.getState().track({
      orderId: 'o-1',
      fundingSource: 'transfer',
      createdAt: Date.now() - 6 * 24 * 60 * 60 * 1000,
    })
    vi.mocked(getFundingOrder).mockResolvedValue(
      order('o-1', 'PENDING', 'INTENT_AWAITING_FUNDS') as any
    )
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })
    const { result } = renderHook(() => useIsCheckoutBusy(), {
      wrapper: wrap(store, client),
    })
    await waitFor(() =>
      expect(client.getQueryData(['funding-order', 'o-1'])).toBeDefined()
    )
    expect(result.current).toBe(false)
  })

  it('is not busy with no tracked orders', () => {
    const store = createOnRampSessionsStore()
    const { result } = renderHook(() => useIsCheckoutBusy(), {
      wrapper: wrap(store, new QueryClient()),
    })
    expect(result.current).toBe(false)
    expect(getFundingOrder).not.toHaveBeenCalled()
  })

  it('is not busy with a pending order older than 24 hours', async () => {
    const store = createOnRampSessionsStore()
    store.getState().register('s1', makeSession(false))
    useFundingOrderStore.getState().track({
      orderId: 'o-1',
      fundingSource: 'cash',
      createdAt: Date.now() - 25 * 60 * 60 * 1000,
    })
    vi.mocked(getFundingOrder).mockResolvedValue(order('o-1', 'PENDING') as any)
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })
    const { result } = renderHook(() => useIsCheckoutBusy(), {
      wrapper: wrap(store, client),
    })
    await waitFor(() =>
      expect(client.getQueryData(['funding-order', 'o-1'])).toBeDefined()
    )
    expect(result.current).toBe(false)
  })
})
