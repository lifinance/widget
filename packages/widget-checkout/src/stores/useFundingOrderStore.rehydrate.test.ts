// @vitest-environment happy-dom
import { beforeEach, describe, expect, it, vi } from 'vitest'

describe('useFundingOrderStore construction-time rehydration', () => {
  beforeEach(() => {
    vi.resetModules()
    localStorage.clear()
  })

  it('prunes stale records during automatic hydration on module load', async () => {
    const now = Date.now()
    localStorage.setItem(
      'lifi-checkout-orders',
      JSON.stringify({
        state: {
          orders: {
            stale: {
              orderId: 'stale',
              fundingSource: 'transfer',
              createdAt: now - 7 * 24 * 60 * 60 * 1000 - 1,
            },
            fresh: {
              orderId: 'fresh',
              fundingSource: 'wallet',
              createdAt: now,
            },
          },
        },
        version: 1,
      })
    )
    const { useFundingOrderStore } = await import('./useFundingOrderStore.js')
    const orders = useFundingOrderStore.getState().orders
    expect(orders.stale).toBeUndefined()
    expect(orders.fresh).toBeDefined()
  })
})
