// @vitest-environment happy-dom

import type { CheckoutContextValue } from '@lifi/widget-provider/checkout'
import { CheckoutContext } from '@lifi/widget-provider/checkout'
import { renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const useAccountMock = vi.fn()
vi.mock('@lifi/wallet-management', () => ({
  useAccount: () => useAccountMock(),
}))

import {
  buildPendingRecord,
  usePendingCheckoutStore,
} from '../stores/usePendingCheckoutStore.js'
import { useResumeKey } from './useResumeKey.js'

function wrap(checkout: CheckoutContextValue) {
  return ({ children }: { children: ReactNode }) => (
    <CheckoutContext.Provider value={checkout}>
      {children}
    </CheckoutContext.Provider>
  )
}

function seedDeposit(key: string, createdAt?: number) {
  usePendingCheckoutStore.getState().write(
    key,
    buildPendingRecord({
      fundingSource: 'cash',
      depositAddress: key.split(':')[1],
      fromChain: 1,
      provider: 'transak',
      status: 'confirmed-no-hash',
      createdAt,
    })
  )
}

function connectWallet(address: string) {
  useAccountMock.mockReturnValue({
    accounts: [{ isConnected: true, address }],
  })
}

describe('useResumeKey', () => {
  beforeEach(() => {
    usePendingCheckoutStore.getState().clearAll()
    useAccountMock.mockReset()
    useAccountMock.mockReturnValue({ accounts: [] })
  })

  it('returns null when there is no live record', () => {
    const { result } = renderHook(() => useResumeKey(), {
      wrapper: wrap({ integrator: 'int' }),
    })
    expect(result.current).toBeNull()
  })

  it('resolves a deposit-keyed record when no wallet is connected', () => {
    seedDeposit('int:0xdeposit')
    const { result } = renderHook(() => useResumeKey(), {
      wrapper: wrap({ integrator: 'int' }),
    })
    expect(result.current).toBe('int:0xdeposit')
  })

  it('keeps a deposit-keyed record visible after a wallet connects', () => {
    // Regression: previously the wallet branch returned the (record-less)
    // wallet key, hiding the live deposit-keyed record once a wallet connected.
    seedDeposit('int:0xdeposit')
    connectWallet('0xwallet')
    const { result } = renderHook(() => useResumeKey(), {
      wrapper: wrap({ integrator: 'int' }),
    })
    expect(result.current).toBe('int:0xdeposit')
  })

  it('prefers the wallet record when it is the most recent', () => {
    seedDeposit('int:0xdeposit', Date.now() - 1000)
    seedDeposit('int:0xwallet', Date.now())
    connectWallet('0xwallet')
    const { result } = renderHook(() => useResumeKey(), {
      wrapper: wrap({ integrator: 'int' }),
    })
    expect(result.current).toBe('int:0xwallet')
  })

  it('ignores expired records', () => {
    seedDeposit('int:0xdeposit', Date.now() - 25 * 60 * 60 * 1000)
    const { result } = renderHook(() => useResumeKey(), {
      wrapper: wrap({ integrator: 'int' }),
    })
    expect(result.current).toBeNull()
  })

  it('ignores records from other integrators', () => {
    seedDeposit('other:0xdeposit')
    const { result } = renderHook(() => useResumeKey(), {
      wrapper: wrap({ integrator: 'int' }),
    })
    expect(result.current).toBeNull()
  })
})
