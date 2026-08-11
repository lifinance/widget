import { beforeEach, describe, expect, it } from 'vitest'
import {
  FUNDING_ORDER_RETENTION_MS,
  listTrackedOrders,
  useFundingOrderStore,
} from './useFundingOrderStore.js'

describe('useFundingOrderStore', () => {
  beforeEach(() => {
    useFundingOrderStore.getState().clearAll()
  })

  it('tracks an order and lists it newest first', () => {
    const now = Date.now()
    const { track } = useFundingOrderStore.getState()
    track({ orderId: 'a', fundingSource: 'wallet', createdAt: now - 2 })
    track({ orderId: 'b', fundingSource: 'transfer', createdAt: now - 1 })
    const list = listTrackedOrders(useFundingOrderStore.getState().orders, now)
    expect(list.map((o) => o.orderId)).toEqual(['b', 'a'])
  })

  it('acknowledge removes the record', () => {
    const { track, acknowledge } = useFundingOrderStore.getState()
    track({ orderId: 'a', fundingSource: 'cash', createdAt: Date.now() })
    expect(useFundingOrderStore.getState().orders.a).toBeDefined()
    acknowledge('a')
    expect(useFundingOrderStore.getState().orders.a).toBeUndefined()
  })

  it('prunes records older than the retention window on write', () => {
    const now = Date.now()
    const { track } = useFundingOrderStore.getState()
    track({
      orderId: 'old',
      fundingSource: 'transfer',
      createdAt: now - FUNDING_ORDER_RETENTION_MS - 1,
    })
    track({ orderId: 'fresh', fundingSource: 'transfer', createdAt: now })
    expect(useFundingOrderStore.getState().orders.old).toBeUndefined()
    expect(useFundingOrderStore.getState().orders.fresh).toBeDefined()
  })
})
