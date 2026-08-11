// @vitest-environment happy-dom
import { act, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it } from 'vitest'
import {
  CheckoutFlowStoreProvider,
  useCheckoutFlowStore,
} from '../stores/useCheckoutFlowStore.js'
import { INTENT_FACTORY_ONLY } from '../utils/checkoutDefaults.js'
import { useCheckoutAllowExchanges } from './useCheckoutAllowExchanges.js'

const wrapper = ({ children }: { children: ReactNode }) => (
  <CheckoutFlowStoreProvider>{children}</CheckoutFlowStoreProvider>
)

function useHarness() {
  return {
    allowExchanges: useCheckoutAllowExchanges(),
    setFundingSource: useCheckoutFlowStore((s) => s.setFundingSource),
  }
}

describe('useCheckoutAllowExchanges', () => {
  it('is undefined when no funding source is set', () => {
    const { result } = renderHook(useHarness, { wrapper })
    expect(result.current.allowExchanges).toBeUndefined()
  })

  it('is undefined for the wallet funding source', () => {
    const { result } = renderHook(useHarness, { wrapper })
    act(() => {
      result.current.setFundingSource('wallet')
    })
    expect(result.current.allowExchanges).toBeUndefined()
  })

  it.each(['transfer', 'exchange', 'cash'] as const)(
    'is the IF-only allow-list for the %s funding source',
    (fundingSource) => {
      const { result } = renderHook(useHarness, { wrapper })
      act(() => {
        result.current.setFundingSource(fundingSource)
      })
      expect(result.current.allowExchanges).toEqual([...INTENT_FACTORY_ONLY])
    }
  )

  it('returns a stable array identity across re-renders for the same funding source', () => {
    const { result, rerender } = renderHook(useHarness, { wrapper })
    act(() => {
      result.current.setFundingSource('transfer')
    })
    const first = result.current.allowExchanges
    rerender()
    expect(result.current.allowExchanges).toBe(first)
  })
})
