// @vitest-environment happy-dom

import type {
  CheckoutContextValue,
  OnRampSession,
} from '@lifi/widget-provider/checkout'
import {
  CheckoutContext,
  createOnRampSessionsStore,
  OnRampSessionsContext,
  type OnRampSessionsStore,
} from '@lifi/widget-provider/checkout'
import { act, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@lifi/wallet-management', () => ({
  useAccount: () => ({ accounts: [] }),
}))

import {
  buildPendingRecord,
  usePendingCheckoutStore,
} from '../stores/usePendingCheckoutStore.js'
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

function wrap(store: OnRampSessionsStore | null) {
  return ({ children }: { children: ReactNode }) =>
    store ? (
      <OnRampSessionsContext.Provider value={store}>
        {children}
      </OnRampSessionsContext.Provider>
    ) : (
      children
    )
}

describe('useIsCheckoutBusy', () => {
  it('returns false when no provider is mounted', () => {
    const { result } = renderHook(() => useIsCheckoutBusy(), {
      wrapper: wrap(null),
    })
    expect(result.current).toBe(false)
  })

  it('returns false when sessions are empty', () => {
    const store = createOnRampSessionsStore()
    const { result } = renderHook(() => useIsCheckoutBusy(), {
      wrapper: wrap(store),
    })
    expect(result.current).toBe(false)
  })

  it('returns false when the only session is closed', () => {
    const store = createOnRampSessionsStore()
    store.getState().register('s1', makeSession(false))
    const { result } = renderHook(() => useIsCheckoutBusy(), {
      wrapper: wrap(store),
    })
    expect(result.current).toBe(false)
  })

  it('returns true when at least one session is open', () => {
    const store = createOnRampSessionsStore()
    store.getState().register('s1', makeSession(true))
    const { result } = renderHook(() => useIsCheckoutBusy(), {
      wrapper: wrap(store),
    })
    expect(result.current).toBe(true)
  })

  it('returns true when one of two sessions is open', () => {
    const store = createOnRampSessionsStore()
    store.getState().register('s1', makeSession(false))
    store.getState().register('s2', makeSession(true))
    const { result } = renderHook(() => useIsCheckoutBusy(), {
      wrapper: wrap(store),
    })
    expect(result.current).toBe(true)
  })

  it('reacts to session updates', () => {
    const store = createOnRampSessionsStore()
    store.getState().register('s1', makeSession(false))
    const { result } = renderHook(() => useIsCheckoutBusy(), {
      wrapper: wrap(store),
    })
    expect(result.current).toBe(false)
    act(() => {
      store.getState().register('s1', makeSession(true))
    })
    expect(result.current).toBe(true)
  })
})

function wrapWithCheckout(
  checkout: CheckoutContextValue,
  store: OnRampSessionsStore
) {
  return ({ children }: { children: ReactNode }) => (
    <CheckoutContext.Provider value={checkout}>
      <OnRampSessionsContext.Provider value={store}>
        {children}
      </OnRampSessionsContext.Provider>
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

describe('useIsCheckoutBusy — pending record (post-payment) gate', () => {
  beforeEach(() => {
    usePendingCheckoutStore.getState().clearAll()
  })

  it('is busy with a live record even when all sessions are closed', () => {
    const store = createOnRampSessionsStore()
    store.getState().register('s1', makeSession(false))
    seedRecord('int:0xdeposit')
    const { result } = renderHook(() => useIsCheckoutBusy(), {
      wrapper: wrapWithCheckout({ integrator: 'int' }, store),
    })
    expect(result.current).toBe(true)
  })

  it('ignores expired records', () => {
    const store = createOnRampSessionsStore()
    // 25h ago — past the 24h TTL.
    seedRecord('int:0xdeposit', Date.now() - 25 * 60 * 60 * 1000)
    const { result } = renderHook(() => useIsCheckoutBusy(), {
      wrapper: wrapWithCheckout({ integrator: 'int' }, store),
    })
    expect(result.current).toBe(false)
  })

  it('ignores records from other integrators', () => {
    const store = createOnRampSessionsStore()
    seedRecord('other:0xdeposit')
    const { result } = renderHook(() => useIsCheckoutBusy(), {
      wrapper: wrapWithCheckout({ integrator: 'int' }, store),
    })
    expect(result.current).toBe(false)
  })

  it('is not busy when resumePending is disabled', () => {
    const store = createOnRampSessionsStore()
    seedRecord('int:0xdeposit')
    const { result } = renderHook(() => useIsCheckoutBusy(), {
      wrapper: wrapWithCheckout(
        { integrator: 'int', resumePending: false },
        store
      ),
    })
    expect(result.current).toBe(false)
  })
})
