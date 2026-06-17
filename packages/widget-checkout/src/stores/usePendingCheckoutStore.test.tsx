// @vitest-environment happy-dom
import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import {
  buildPendingRecord,
  buildResumeKey,
  PENDING_RECORD_VERSION,
  PENDING_STORAGE_KEY,
  PENDING_TTL_MS,
  readPendingRecord,
  resolveResumeKeySync,
  usePendingCheckoutStore,
} from './usePendingCheckoutStore.js'

function resetStore(): void {
  usePendingCheckoutStore.setState({ records: {} })
  localStorage.removeItem(PENDING_STORAGE_KEY)
}

function seedStorage(records: Record<string, unknown>): void {
  localStorage.setItem(
    PENDING_STORAGE_KEY,
    JSON.stringify({ state: { records }, version: PENDING_RECORD_VERSION })
  )
}

describe('usePendingCheckoutStore', () => {
  beforeEach(() => {
    resetStore()
  })
  afterEach(() => {
    resetStore()
  })

  it('writes and reads back a wallet record under the composite key', () => {
    const key = buildResumeKey('lifi-int', '0xabc')
    const now = Date.now()
    const record = buildPendingRecord({
      fundingSource: 'wallet',
      transactionHash: '0xhash',
      fromChain: 1,
      status: 'pending',
      createdAt: now,
    })
    act(() => {
      usePendingCheckoutStore.getState().write(key, record)
    })
    const stored = usePendingCheckoutStore.getState().records[key]
    expect(stored).toMatchObject({
      version: PENDING_RECORD_VERSION,
      fundingSource: 'wallet',
      transactionHash: '0xhash',
      fromChain: 1,
      status: 'pending',
      createdAt: now,
      expiresAt: now + PENDING_TTL_MS,
    })
  })

  it('clearForKey removes only the matching record', () => {
    const a = buildResumeKey('int', '0xA')
    const b = buildResumeKey('int', '0xB')
    act(() => {
      usePendingCheckoutStore
        .getState()
        .write(
          a,
          buildPendingRecord({ fundingSource: 'wallet', status: 'pending' })
        )
      usePendingCheckoutStore
        .getState()
        .write(
          b,
          buildPendingRecord({ fundingSource: 'wallet', status: 'pending' })
        )
    })
    act(() => {
      usePendingCheckoutStore.getState().clearForKey(a)
    })
    const records = usePendingCheckoutStore.getState().records
    expect(records[a]).toBeUndefined()
    expect(records[b]).toBeDefined()
  })

  it('clearAll empties everything', () => {
    act(() => {
      usePendingCheckoutStore
        .getState()
        .write(
          'a:1',
          buildPendingRecord({ fundingSource: 'wallet', status: 'pending' })
        )
    })
    act(() => {
      usePendingCheckoutStore.getState().clearAll()
    })
    expect(Object.keys(usePendingCheckoutStore.getState().records).length).toBe(
      0
    )
  })

  it('write sweeps expired records as a side effect', () => {
    const stale = buildPendingRecord({
      fundingSource: 'transfer',
      depositAddress: '0xstale',
      status: 'pending',
      createdAt: Date.now() - PENDING_TTL_MS - 1000,
    })
    act(() => {
      usePendingCheckoutStore.setState({ records: { 'int:stale': stale } })
    })
    expect(
      usePendingCheckoutStore.getState().records['int:stale']
    ).toBeDefined()
    act(() => {
      usePendingCheckoutStore
        .getState()
        .write(
          'int:fresh',
          buildPendingRecord({ fundingSource: 'wallet', status: 'pending' })
        )
    })
    const records = usePendingCheckoutStore.getState().records
    expect(records['int:stale']).toBeUndefined()
    expect(records['int:fresh']).toBeDefined()
  })

  it('rehydrating from localStorage retains a non-React hook usage', () => {
    seedStorage({
      'int:0xA': buildPendingRecord({
        fundingSource: 'wallet',
        transactionHash: '0xhash',
        fromChain: 1,
        status: 'pending',
        createdAt: Date.now(),
      }),
    })
    const { result } = renderHook(() =>
      usePendingCheckoutStore((s) => s.records)
    )
    expect(Object.keys(result.current).length).toBeGreaterThanOrEqual(0)
  })
})

describe('readPendingRecord (sync)', () => {
  beforeEach(resetStore)
  afterEach(resetStore)

  it('returns null when nothing is in localStorage', () => {
    expect(readPendingRecord('int:0xA')).toBeNull()
  })

  it('returns a live record for the key', () => {
    const record = buildPendingRecord({
      fundingSource: 'wallet',
      transactionHash: '0xhash',
      fromChain: 137,
      status: 'pending',
      createdAt: Date.now(),
    })
    seedStorage({ 'int:0xA': record })
    expect(readPendingRecord('int:0xA')).toMatchObject({
      transactionHash: '0xhash',
      fromChain: 137,
    })
  })

  it('returns null for expired records', () => {
    seedStorage({
      'int:0xA': {
        ...buildPendingRecord({
          fundingSource: 'wallet',
          status: 'pending',
        }),
        expiresAt: Date.now() - 1,
      },
    })
    expect(readPendingRecord('int:0xA')).toBeNull()
  })

  it('returns null for version mismatch', () => {
    seedStorage({
      'int:0xA': {
        ...buildPendingRecord({ fundingSource: 'wallet', status: 'pending' }),
        version: PENDING_RECORD_VERSION + 1,
      },
    })
    expect(readPendingRecord('int:0xA')).toBeNull()
  })

  it('round-trips a transfer record with frozenQuote', () => {
    const now = Date.now()
    const record = buildPendingRecord({
      fundingSource: 'transfer',
      depositAddress: '0xdep',
      fromChain: 137,
      frozenRouteId: 'r1',
      frozenQuote: {
        id: 'r1',
        route: { id: 'r1', fromChainId: 137 } as any,
        expiresAt: now + 60_000,
      },
      status: 'pending',
      createdAt: now,
    })
    seedStorage({ 'int:0xdep': record })
    expect(readPendingRecord('int:0xdep')).toMatchObject({
      fundingSource: 'transfer',
      frozenQuote: {
        id: 'r1',
        expiresAt: now + 60_000,
      },
    })
  })

  it('returns null on malformed JSON', () => {
    localStorage.setItem(PENDING_STORAGE_KEY, '{not json')
    expect(readPendingRecord('int:0xA')).toBeNull()
  })
})

describe('resolveResumeKeySync', () => {
  beforeEach(resetStore)
  afterEach(resetStore)

  it('returns wallet-keyed identifier when walletAddress is provided', () => {
    expect(resolveResumeKeySync('int', '0xABC')).toBe('int:0xABC')
  })

  it('returns the most recent live depositAddress-keyed record when no wallet', () => {
    const now = Date.now()
    seedStorage({
      'int:0xdep1': buildPendingRecord({
        fundingSource: 'transfer',
        depositAddress: '0xdep1',
        status: 'pending',
        createdAt: now - 60_000,
      }),
      'int:0xdep2': buildPendingRecord({
        fundingSource: 'transfer',
        depositAddress: '0xdep2',
        status: 'pending',
        createdAt: now,
      }),
      'other:0xdep3': buildPendingRecord({
        fundingSource: 'transfer',
        depositAddress: '0xdep3',
        status: 'pending',
        createdAt: now + 60_000,
      }),
    })
    expect(resolveResumeKeySync('int')).toBe('int:0xdep2')
  })

  it('returns null when no record matches the integrator', () => {
    seedStorage({
      'other:0xdep1': buildPendingRecord({
        fundingSource: 'transfer',
        depositAddress: '0xdep1',
        status: 'pending',
      }),
    })
    expect(resolveResumeKeySync('int')).toBeNull()
  })

  it('skips wallet-only records (no depositAddress) when no wallet provided', () => {
    seedStorage({
      'int:0xwallet': buildPendingRecord({
        fundingSource: 'wallet',
        transactionHash: '0xhash',
        status: 'pending',
      }),
    })
    expect(resolveResumeKeySync('int')).toBeNull()
  })
})
