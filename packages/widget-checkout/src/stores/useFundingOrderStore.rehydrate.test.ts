// @vitest-environment happy-dom
import { beforeEach, describe, expect, it } from 'vitest'
import {
  FUNDING_ORDER_RETENTION_MS,
  FUNDING_ORDER_STORAGE_KEY,
  type TrackedFundingOrder,
  useFundingOrderStore,
} from './useFundingOrderStore.js'

describe('useFundingOrderStore rehydration', () => {
  beforeEach(() => {
    useFundingOrderStore.getState().clearAll()
    localStorage.clear()
  })

  it('prunes stale orders on rehydrate from storage', async () => {
    const now = Date.now()
    const staleOrder: TrackedFundingOrder = {
      orderId: 'stale',
      fundingSource: 'transfer',
      createdAt: now - FUNDING_ORDER_RETENTION_MS - 1,
    }
    const freshOrder: TrackedFundingOrder = {
      orderId: 'fresh',
      fundingSource: 'transfer',
      createdAt: now,
    }

    // Write both stale and fresh orders to localStorage in persist format
    const storageState = {
      state: {
        orders: {
          stale: staleOrder,
          fresh: freshOrder,
        },
      },
      version: 1,
    }
    localStorage.setItem(
      FUNDING_ORDER_STORAGE_KEY,
      JSON.stringify(storageState)
    )

    // Rehydrate from storage
    await (useFundingOrderStore as any).persist.rehydrate()

    // Assert that only the fresh order remains
    const state = useFundingOrderStore.getState()
    expect(state.orders.fresh).toBeDefined()
    expect(state.orders.fresh.orderId).toBe('fresh')
    expect(state.orders.stale).toBeUndefined()
  })
})
