// @vitest-environment happy-dom
import { CheckoutContext } from '@lifi/widget-provider/checkout'
import { act, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { CheckoutFlowStoreProvider } from '../stores/useCheckoutFlowStore.js'
import {
  buildResumeKey,
  PENDING_STORAGE_KEY,
  type PersistedFrozenQuote,
  usePendingCheckoutStore,
} from '../stores/usePendingCheckoutStore.js'
import { usePendingCheckoutWriter } from './usePendingCheckoutWriter.js'

function resetStore(): void {
  usePendingCheckoutStore.setState({ records: {} })
  localStorage.removeItem(PENDING_STORAGE_KEY)
}

function wrap(resumePending: boolean | undefined) {
  return ({ children }: { children: ReactNode }) => (
    <CheckoutFlowStoreProvider>
      <CheckoutContext.Provider value={{ integrator: 'int', resumePending }}>
        {children}
      </CheckoutContext.Provider>
    </CheckoutFlowStoreProvider>
  )
}

function frozenQuote(id: string): PersistedFrozenQuote {
  return {
    id,
    route: {
      id,
      fromAmount: '100000000',
      fromToken: { symbol: 'USDC', decimals: 6, logoURI: 'usdc.png' },
    } as never,
    expiresAt: Date.now() + 60_000,
  }
}

function recordKeys(): string[] {
  return Object.keys(usePendingCheckoutStore.getState().records)
}

describe('usePendingCheckoutWriter — resumePending gate', () => {
  beforeEach(resetStore)
  afterEach(resetStore)

  it('writes when resumePending is omitted (default true)', () => {
    const { result } = renderHook(() => usePendingCheckoutWriter(), {
      wrapper: wrap(undefined),
    })
    act(() => {
      result.current.writeWallet({
        transactionHash: '0xhash',
        fromChain: 1,
        frozenQuote: frozenQuote('route-1'),
      })
    })
    const key = buildResumeKey('int', '0xhash')
    expect(usePendingCheckoutStore.getState().records[key]).toBeDefined()
  })

  it('writeWallet persists the deposit address, quote, and display fields', () => {
    const { result } = renderHook(() => usePendingCheckoutWriter(), {
      wrapper: wrap(true),
    })
    act(() => {
      result.current.writeWallet({
        transactionHash: '0xhash',
        fromChain: 1,
        depositAddress: '0xdep',
        frozenQuote: frozenQuote('route-3'),
      })
    })
    const key = buildResumeKey('int', '0xdep')
    const record = usePendingCheckoutStore.getState().records[key]
    expect(record.fundingSource).toBe('wallet')
    expect(record.depositAddress).toBe('0xdep')
    expect(record.depositId).toBe('0xdep')
    expect(record.frozenQuote?.id).toBe('route-3')
    expect(record.fromAmount).toBe('100000000')
    expect(record.tokenSymbol).toBe('USDC')
    expect(record.tokenDecimals).toBe(6)
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
        frozenQuote: frozenQuote('route-1'),
      })
    })
    expect(recordKeys().length).toBe(1)
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
        frozenQuote: frozenQuote('route-2'),
      })
    })
    const key = buildResumeKey('int', '0xdep2')
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
      result.current.writeWallet({
        transactionHash: '0xhash',
        fromChain: 1,
        frozenQuote: frozenQuote('route-1'),
      })
      result.current.writeTransfer({
        depositAddress: '0xdep',
        fromChain: 137,
        frozenRouteId: 'route-1',
        frozenQuote: frozenQuote('route-1'),
      })
      result.current.writeCashSuccess({
        depositAddress: '0xdep2',
        fromChain: 8453,
        provider: 'transak',
        fundingSource: 'cash',
      })
    })
    expect(recordKeys().length).toBe(0)
  })

  it('clear helpers still operate when resumePending is false (so TTL works)', () => {
    const { result } = renderHook(() => usePendingCheckoutWriter(), {
      wrapper: wrap(true),
    })
    act(() => {
      result.current.writeWallet({
        transactionHash: '0xhash',
        fromChain: 1,
        frozenQuote: frozenQuote('route-1'),
      })
    })
    expect(recordKeys().length).toBe(1)
    const { result: r2 } = renderHook(() => usePendingCheckoutWriter(), {
      wrapper: wrap(false),
    })
    act(() => {
      r2.current.clearAll()
    })
    expect(recordKeys().length).toBe(0)
  })
})

describe('usePendingCheckoutWriter — frozen deposit key', () => {
  beforeEach(resetStore)
  afterEach(resetStore)

  it('reuses one key across multiple writes of the same deposit', () => {
    const { result } = renderHook(() => usePendingCheckoutWriter(), {
      wrapper: wrap(true),
    })
    act(() => {
      // First write has only the tx hash; a later write of the same deposit
      // also carries the deposit address. Both must land on one record.
      result.current.writeWallet({
        transactionHash: '0xhash',
        fromChain: 1,
        frozenQuote: frozenQuote('route-1'),
      })
      result.current.writeWallet({
        transactionHash: '0xhash',
        fromChain: 1,
        depositAddress: '0xdep',
        frozenQuote: frozenQuote('route-1'),
      })
    })
    expect(recordKeys()).toEqual([buildResumeKey('int', '0xhash')])
    const record =
      usePendingCheckoutStore.getState().records[
        buildResumeKey('int', '0xhash')
      ]
    expect(record.depositAddress).toBe('0xdep')
  })

  it('gives distinct deposits (separate flows) distinct keys', () => {
    const flowA = renderHook(() => usePendingCheckoutWriter(), {
      wrapper: wrap(true),
    })
    act(() => {
      flowA.result.current.writeWallet({
        transactionHash: '0xAAA',
        fromChain: 1,
        frozenQuote: frozenQuote('route-a'),
      })
    })
    const flowB = renderHook(() => usePendingCheckoutWriter(), {
      wrapper: wrap(true),
    })
    act(() => {
      flowB.result.current.writeWallet({
        transactionHash: '0xBBB',
        fromChain: 1,
        frozenQuote: frozenQuote('route-b'),
      })
    })
    expect(recordKeys().sort()).toEqual(
      [buildResumeKey('int', '0xAAA'), buildResumeKey('int', '0xBBB')].sort()
    )
  })
})
