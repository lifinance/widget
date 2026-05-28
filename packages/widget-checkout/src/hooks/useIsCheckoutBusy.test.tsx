// @vitest-environment happy-dom

import type { OnRampSession } from '@lifi/widget-provider/checkout'
import {
  createOnRampSessionsStore,
  OnRampSessionsContext,
  type OnRampSessionsStore,
} from '@lifi/widget-provider/checkout'
import { act, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'

vi.mock('@lifi/wallet-management', () => ({
  useAccount: () => ({ accounts: [] }),
}))

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
