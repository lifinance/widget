// @vitest-environment happy-dom

import { renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

let fundingSource: string | null = null
vi.mock('../stores/useCheckoutFlowStore.js', () => ({
  useCheckoutFlowStore: (
    selector: (state: { fundingSource: string | null }) => unknown
  ) => selector({ fundingSource }),
}))

vi.mock('../providers/OnRampProvider/OnRampProvider.js', () => ({
  useOnRampProviderByCategory: (category: string | null) =>
    category === 'cash'
      ? {
          id: 'transak',
          fundingCategory: 'cash',
          name: 'Transak',
          description: '',
          features: [],
          preconnectOrigins: ['https://global.transak.com'],
        }
      : null,
}))

import { useOnRampPreconnect } from './useOnRampPreconnect.js'

function preconnectHrefs(): string[] {
  return Array.from(
    document.head.querySelectorAll('link[rel="preconnect"]')
  ).map((link) => link.getAttribute('href') ?? '')
}

describe('useOnRampPreconnect', () => {
  afterEach(() => {
    for (const link of Array.from(document.head.querySelectorAll('link'))) {
      link.remove()
    }
  })

  it('injects a preconnect link for the provider origin for cash', () => {
    fundingSource = 'cash'
    renderHook(() => useOnRampPreconnect())
    expect(preconnectHrefs()).toEqual(['https://global.transak.com'])
    expect(
      document.head.querySelectorAll('link[rel="dns-prefetch"]')
    ).toHaveLength(1)
  })

  it('removes the links on unmount', () => {
    fundingSource = 'cash'
    const { unmount } = renderHook(() => useOnRampPreconnect())
    expect(preconnectHrefs()).toHaveLength(1)
    unmount()
    expect(preconnectHrefs()).toHaveLength(0)
  })

  it('does not duplicate existing links and keeps them until the last owner unmounts', () => {
    fundingSource = 'cash'
    const first = renderHook(() => useOnRampPreconnect())
    const second = renderHook(() => useOnRampPreconnect())
    expect(preconnectHrefs()).toHaveLength(1)
    first.unmount()
    expect(preconnectHrefs()).toHaveLength(1)
    second.unmount()
    expect(preconnectHrefs()).toHaveLength(0)
  })

  it('injects nothing for wallet funding', () => {
    fundingSource = 'wallet'
    renderHook(() => useOnRampPreconnect())
    expect(preconnectHrefs()).toHaveLength(0)
  })
})
