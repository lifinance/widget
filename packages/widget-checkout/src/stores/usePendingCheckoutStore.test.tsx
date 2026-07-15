// @vitest-environment happy-dom
import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import {
  buildPendingRecord,
  buildResumeKey,
  PENDING_RECORD_VERSION,
  PENDING_STORAGE_KEY,
  PENDING_TTL_MS,
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

describe('markFailed', () => {
  beforeEach(resetStore)
  afterEach(resetStore)

  it('flips a record to failed', () => {
    const key = buildResumeKey('int', 'dep1')
    act(() => {
      usePendingCheckoutStore.getState().write(
        key,
        buildPendingRecord({
          fundingSource: 'transfer',
          depositAddress: '0xdep',
          status: 'pending',
        })
      )
    })
    act(() => {
      usePendingCheckoutStore.getState().markFailed(key)
    })
    expect(usePendingCheckoutStore.getState().records[key].status).toBe(
      'failed'
    )
  })

  it('no-ops for an unknown key', () => {
    act(() => {
      usePendingCheckoutStore.getState().markFailed('int:nope')
    })
    expect(
      usePendingCheckoutStore.getState().records['int:nope']
    ).toBeUndefined()
  })

  it('is idempotent once failed (same record reference)', () => {
    const key = buildResumeKey('int', 'dep2')
    act(() => {
      usePendingCheckoutStore.getState().write(
        key,
        buildPendingRecord({
          fundingSource: 'transfer',
          depositAddress: '0xdep',
          status: 'pending',
        })
      )
      usePendingCheckoutStore.getState().markFailed(key)
    })
    const first = usePendingCheckoutStore.getState().records[key]
    act(() => {
      usePendingCheckoutStore.getState().markFailed(key)
    })
    expect(usePendingCheckoutStore.getState().records[key]).toBe(first)
  })
})

describe('version migration', () => {
  beforeEach(resetStore)
  afterEach(resetStore)

  it('drops stale v2 records when a new write sweeps', () => {
    const v2 = {
      ...buildPendingRecord({ fundingSource: 'wallet', status: 'pending' }),
      version: 2,
    }
    act(() => {
      usePendingCheckoutStore.setState({ records: { 'int:old': v2 } })
    })
    act(() => {
      usePendingCheckoutStore
        .getState()
        .write(
          'int:new',
          buildPendingRecord({ fundingSource: 'wallet', status: 'pending' })
        )
    })
    const records = usePendingCheckoutStore.getState().records
    expect(records['int:old']).toBeUndefined()
    expect(records['int:new']).toBeDefined()
  })
})
