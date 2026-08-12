// @vitest-environment happy-dom
import { act, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it } from 'vitest'
import {
  CheckoutFlowStoreProvider,
  useCheckoutFlowStore,
} from '../stores/useCheckoutFlowStore.js'
import { INTENT_FACTORY_ONLY } from '../utils/checkoutDefaults.js'
import { useCheckoutToolFilter } from './useCheckoutToolFilter.js'

const wrapper = ({ children }: { children: ReactNode }) => (
  <CheckoutFlowStoreProvider>{children}</CheckoutFlowStoreProvider>
)

function useHarness() {
  return {
    filter: useCheckoutToolFilter(),
    setFundingSource: useCheckoutFlowStore((s) => s.setFundingSource),
  }
}

describe('useCheckoutToolFilter', () => {
  it('is empty when no funding source is set', () => {
    const { result } = renderHook(useHarness, { wrapper })
    expect(result.current.filter.allowBridges).toBeUndefined()
    expect(result.current.filter.allowExchanges).toBeUndefined()
  })

  it('is empty for the wallet funding source', () => {
    const { result } = renderHook(useHarness, { wrapper })
    act(() => {
      result.current.setFundingSource('wallet')
    })
    expect(result.current.filter.allowBridges).toBeUndefined()
    expect(result.current.filter.allowExchanges).toBeUndefined()
  })

  // An exchange allow-list only constrains swap steps, so on a cross-chain
  // pair it never binds and the backend answers with ordinary bridge routes
  // that carry no deposit address. The funding backend pins both axes for a
  // SMART_DEPOSIT order; the pre-commit preview has to ask for the same thing.
  it.each(['transfer', 'exchange', 'cash'] as const)(
    'pins both bridges and exchanges to the IF-only tool for the %s funding source',
    (fundingSource) => {
      const { result } = renderHook(useHarness, { wrapper })
      act(() => {
        result.current.setFundingSource(fundingSource)
      })
      expect(result.current.filter.allowBridges).toEqual([
        ...INTENT_FACTORY_ONLY,
      ])
      expect(result.current.filter.allowExchanges).toEqual([
        ...INTENT_FACTORY_ONLY,
      ])
    }
  )

  it('returns a stable identity across re-renders for the same funding source', () => {
    const { result, rerender } = renderHook(useHarness, { wrapper })
    act(() => {
      result.current.setFundingSource('transfer')
    })
    const first = result.current.filter
    rerender()
    expect(result.current.filter).toBe(first)
  })
})
