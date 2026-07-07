// @vitest-environment happy-dom
import { CheckoutContext } from '@lifi/widget-provider/checkout'
import { act, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@lifi/wallet-management', () => ({
  useAccount: () => ({
    accounts: [{ isConnected: true, address: '0xWALLET' }],
  }),
}))

import {
  buildResumeKey,
  PENDING_STORAGE_KEY,
  usePendingCheckoutStore,
} from '../stores/usePendingCheckoutStore.js'
import { usePendingCheckoutWriter } from './usePendingCheckoutWriter.js'

function resetStore(): void {
  usePendingCheckoutStore.setState({ records: {} })
  localStorage.removeItem(PENDING_STORAGE_KEY)
}

function wrap(resumePending: boolean | undefined) {
  return ({ children }: { children: ReactNode }) => (
    <CheckoutContext.Provider value={{ integrator: 'int', resumePending }}>
      {children}
    </CheckoutContext.Provider>
  )
}

describe('usePendingCheckoutWriter — resumePending gate', () => {
  beforeEach(resetStore)
  afterEach(resetStore)

  it('writes when resumePending is omitted (default true)', () => {
    const { result } = renderHook(() => usePendingCheckoutWriter(), {
      wrapper: wrap(undefined),
    })
    act(() => {
      result.current.writeWallet({ transactionHash: '0xhash', fromChain: 1 })
    })
    const key = buildResumeKey('int', '0xWALLET')
    expect(usePendingCheckoutStore.getState().records[key]).toBeDefined()
  })

  it('writeWallet persists the deposit address and frozen quote', () => {
    const { result } = renderHook(() => usePendingCheckoutWriter(), {
      wrapper: wrap(true),
    })
    act(() => {
      result.current.writeWallet({
        transactionHash: '0xhash',
        fromChain: 1,
        depositAddress: '0xdep',
        frozenQuote: {
          id: 'route-3',
          route: { id: 'route-3' } as any,
          expiresAt: Date.now() + 60_000,
        },
      })
    })
    const key = buildResumeKey('int', '0xWALLET')
    const record = usePendingCheckoutStore.getState().records[key]
    expect(record.fundingSource).toBe('wallet')
    expect(record.depositAddress).toBe('0xdep')
    expect(record.frozenQuote?.id).toBe('route-3')
  })

  it('writes when resumePending is explicitly true', () => {
    const { result } = renderHook(() => usePendingCheckoutWriter(), {
      wrapper: wrap(true),
    })
    act(() => {
      result.current.writeTransfer({
        depositAddress: '0xdep',
        fromChain: 137,
        frozenRouteId: 'route-1',
        frozenQuote: {
          id: 'route-1',
          route: {} as any,
          expiresAt: Date.now() + 60_000,
        },
      })
    })
    expect(Object.keys(usePendingCheckoutStore.getState().records).length).toBe(
      1
    )
  })

  it('writeCashSuccess persists the frozen quote for resume', () => {
    const { result } = renderHook(() => usePendingCheckoutWriter(), {
      wrapper: wrap(true),
    })
    act(() => {
      result.current.writeCashSuccess({
        depositAddress: '0xdep2',
        fromChain: 8453,
        provider: 'transak',
        fundingSource: 'cash',
        frozenQuote: {
          id: 'route-2',
          route: { id: 'route-2' } as any,
          expiresAt: Date.now() + 60_000,
        },
      })
    })
    const key = buildResumeKey('int', '0xWALLET')
    const record = usePendingCheckoutStore.getState().records[key]
    expect(record.fundingSource).toBe('cash')
    expect(record.status).toBe('confirmed-no-hash')
    expect(record.frozenQuote?.id).toBe('route-2')
  })

  it('no-ops every write helper when resumePending is false', () => {
    const { result } = renderHook(() => usePendingCheckoutWriter(), {
      wrapper: wrap(false),
    })
    act(() => {
      result.current.writeWallet({ transactionHash: '0xhash', fromChain: 1 })
      result.current.writeTransfer({
        depositAddress: '0xdep',
        fromChain: 137,
        frozenRouteId: 'route-1',
        frozenQuote: {
          id: 'route-1',
          route: {} as any,
          expiresAt: Date.now() + 60_000,
        },
      })
      result.current.writeCashSuccess({
        depositAddress: '0xdep2',
        fromChain: 8453,
        provider: 'transak',
        fundingSource: 'cash',
      })
    })
    expect(Object.keys(usePendingCheckoutStore.getState().records).length).toBe(
      0
    )
  })

  it('clear helpers still operate when resumePending is false (so TTL works)', () => {
    const { result } = renderHook(() => usePendingCheckoutWriter(), {
      wrapper: wrap(true),
    })
    act(() => {
      result.current.writeWallet({ transactionHash: '0xhash', fromChain: 1 })
    })
    expect(Object.keys(usePendingCheckoutStore.getState().records).length).toBe(
      1
    )
    // Now re-render with the flag off and verify clear still works.
    const { result: r2 } = renderHook(() => usePendingCheckoutWriter(), {
      wrapper: wrap(false),
    })
    act(() => {
      r2.current.clearAll()
    })
    expect(Object.keys(usePendingCheckoutStore.getState().records).length).toBe(
      0
    )
  })
})
