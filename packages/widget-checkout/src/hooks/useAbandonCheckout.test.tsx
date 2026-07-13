// @vitest-environment happy-dom
import { CheckoutContext } from '@lifi/widget-provider/checkout'
import { act, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import {
  CheckoutFlowStoreProvider,
  useCheckoutFlowStore,
} from '../stores/useCheckoutFlowStore.js'
import {
  buildPendingRecord,
  buildResumeKey,
  PENDING_STORAGE_KEY,
  usePendingCheckoutStore,
} from '../stores/usePendingCheckoutStore.js'
import { useAbandonCheckout } from './useAbandonCheckout.js'
import {
  FrozenQuoteStoreProvider,
  useFrozenQuote,
  useSeedFrozenQuote,
} from './useFrozenQuote.js'

function resetStore(): void {
  usePendingCheckoutStore.setState({ records: {} })
  localStorage.removeItem(PENDING_STORAGE_KEY)
}

const wrapper = ({ children }: { children: ReactNode }) => (
  <FrozenQuoteStoreProvider>
    <CheckoutFlowStoreProvider>
      <CheckoutContext.Provider
        value={{ integrator: 'int', resumePending: true }}
      >
        {children}
      </CheckoutContext.Provider>
    </CheckoutFlowStoreProvider>
  </FrozenQuoteStoreProvider>
)

function useHarness() {
  return {
    abandon: useAbandonCheckout(),
    seed: useSeedFrozenQuote(),
    frozen: useFrozenQuote().frozen,
    fundingSource: useCheckoutFlowStore((s) => s.fundingSource),
    frozenDepositId: useCheckoutFlowStore((s) => s.frozenDepositId),
    setFundingSource: useCheckoutFlowStore((s) => s.setFundingSource),
    setFrozenDepositId: useCheckoutFlowStore((s) => s.setFrozenDepositId),
  }
}

describe('useAbandonCheckout', () => {
  beforeEach(resetStore)
  afterEach(resetStore)

  it('clears the frozen quote, pending record, and flow state', () => {
    const key = buildResumeKey('int', 'dep-1')
    usePendingCheckoutStore.getState().write(
      key,
      buildPendingRecord({
        fundingSource: 'transfer',
        depositId: 'dep-1',
        depositAddress: 'dep-1',
        fromChain: 1,
        status: 'pending',
      })
    )

    const { result } = renderHook(useHarness, { wrapper })
    act(() => {
      result.current.setFundingSource('transfer')
      result.current.setFrozenDepositId('dep-1')
      result.current.seed({
        id: 'r1',
        route: {} as never,
        expiresAt: Date.now() + 60_000,
      })
    })

    expect(result.current.frozen).not.toBeNull()
    expect(usePendingCheckoutStore.getState().records[key]).toBeDefined()

    act(() => {
      result.current.abandon()
    })

    expect(result.current.frozen).toBeNull()
    expect(usePendingCheckoutStore.getState().records[key]).toBeUndefined()
    expect(result.current.fundingSource).toBeNull()
    expect(result.current.frozenDepositId).toBeNull()
  })
})
