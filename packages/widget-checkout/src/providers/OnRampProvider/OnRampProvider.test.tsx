// @vitest-environment happy-dom
import type { WidgetConfig } from '@lifi/widget/shared'
import type { OnRampProvider } from '@lifi/widget-provider/checkout'
import { renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'

let apiKey: string | undefined
vi.mock('@lifi/widget/shared', () => ({
  StoreProvider: ({ children }: { children: ReactNode }) => children,
  useWidgetConfig: () => ({ elementId: '', integrator: 'int', apiKey }),
}))

vi.mock('../../components/ErrorBoundary.js', () => ({
  ErrorBoundary: ({ children }: { children: ReactNode }) => children,
}))

import {
  OnRampProviderRegistry,
  useOnRampProviderByCategory,
  useOnRampProviderMetas,
} from './OnRampProvider.js'

const cashAdapter = {
  id: 'transak',
  fundingCategory: 'cash',
  name: 'Transak',
  description: '',
  features: [],
  Host: () => null,
} as unknown as OnRampProvider

const exchangeAdapter = {
  id: 'mesh',
  fundingCategory: 'exchange',
  name: 'Mesh',
  description: '',
  features: [],
  Host: () => null,
} as unknown as OnRampProvider

function wrap({ children }: { children: ReactNode }) {
  return (
    <OnRampProviderRegistry
      widgetConfig={{ integrator: 'int' } as WidgetConfig}
      providers={[cashAdapter, exchangeAdapter]}
    >
      {children}
    </OnRampProviderRegistry>
  )
}

describe('useOnRampProviderByCategory', () => {
  it('resolves the cash and exchange providers when an apiKey is configured', () => {
    apiKey = 'key-123'
    const { result } = renderHook(
      () => ({
        cash: useOnRampProviderByCategory('cash'),
        exchange: useOnRampProviderByCategory('exchange'),
      }),
      { wrapper: wrap }
    )
    expect(result.current.cash?.id).toBe('transak')
    expect(result.current.exchange?.id).toBe('mesh')
  })

  // A missing apiKey makes the keyed endpoints fail at call time, which the
  // CTA surfaces as a retryable error. It must not make the funding options
  // vanish - an absent option reads as "unsupported", not "misconfigured".
  it('still resolves them without an apiKey', () => {
    apiKey = undefined
    const { result } = renderHook(
      () => ({
        cash: useOnRampProviderByCategory('cash'),
        exchange: useOnRampProviderByCategory('exchange'),
      }),
      { wrapper: wrap }
    )
    expect(result.current.cash?.id).toBe('transak')
    expect(result.current.exchange?.id).toBe('mesh')
  })

  it('keeps the registered metas visible so CheckoutConfigGuard can still warn', () => {
    apiKey = undefined
    const { result } = renderHook(() => useOnRampProviderMetas(), {
      wrapper: wrap,
    })
    expect(result.current.map((meta) => meta.id)).toEqual(['transak', 'mesh'])
  })
})
