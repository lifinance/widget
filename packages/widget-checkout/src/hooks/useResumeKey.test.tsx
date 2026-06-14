// @vitest-environment happy-dom

import { CheckoutContext } from '@lifi/widget-provider/checkout'
import { renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it } from 'vitest'
import {
  type CheckoutFlowStore,
  CheckoutFlowStoreContext,
  createCheckoutFlowStore,
} from '../stores/useCheckoutFlowStore.js'
import {
  buildPendingRecord,
  buildResumeKey,
  usePendingCheckoutStore,
} from '../stores/usePendingCheckoutStore.js'
import { useResumeKey, useResumeRecord } from './useResumeKey.js'

function makeFlowStore(frozenDepositId: string | null): CheckoutFlowStore {
  const store = createCheckoutFlowStore()
  store.getState().setFrozenDepositId(frozenDepositId)
  return store
}

function wrap(integrator: string, flowStore: CheckoutFlowStore) {
  return ({ children }: { children: ReactNode }) => (
    <CheckoutContext.Provider value={{ integrator }}>
      <CheckoutFlowStoreContext.Provider value={flowStore}>
        {children}
      </CheckoutFlowStoreContext.Provider>
    </CheckoutContext.Provider>
  )
}

function seedRecord(key: string, createdAt?: number) {
  usePendingCheckoutStore.getState().write(
    key,
    buildPendingRecord({
      fundingSource: 'cash',
      depositAddress: '0xdeposit',
      fromChain: 1,
      provider: 'transak',
      status: 'confirmed-no-hash',
      createdAt,
    })
  )
}

describe('useResumeKey', () => {
  beforeEach(() => {
    usePendingCheckoutStore.getState().clearAll()
  })

  it('returns null when no deposit is frozen', () => {
    const { result } = renderHook(() => useResumeKey(), {
      wrapper: wrap('int', makeFlowStore(null)),
    })
    expect(result.current).toBeNull()
  })

  it('builds the key from the frozen deposit id', () => {
    const { result } = renderHook(() => useResumeKey(), {
      wrapper: wrap('int', makeFlowStore('0xdeposit')),
    })
    expect(result.current).toBe(buildResumeKey('int', '0xdeposit'))
  })
})

describe('useResumeRecord', () => {
  beforeEach(() => {
    usePendingCheckoutStore.getState().clearAll()
  })

  it('returns null when the keyed record is absent', () => {
    const { result } = renderHook(() => useResumeRecord(), {
      wrapper: wrap('int', makeFlowStore('0xdeposit')),
    })
    expect(result.current).toBeNull()
  })

  it('returns the live record for the frozen key', () => {
    seedRecord(buildResumeKey('int', '0xdeposit'))
    const { result } = renderHook(() => useResumeRecord(), {
      wrapper: wrap('int', makeFlowStore('0xdeposit')),
    })
    expect(result.current?.depositAddress).toBe('0xdeposit')
  })

  it('returns null when the keyed record is expired', () => {
    seedRecord(
      buildResumeKey('int', '0xdeposit'),
      Date.now() - 25 * 60 * 60 * 1000
    )
    const { result } = renderHook(() => useResumeRecord(), {
      wrapper: wrap('int', makeFlowStore('0xdeposit')),
    })
    expect(result.current).toBeNull()
  })
})
