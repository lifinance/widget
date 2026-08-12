'use client'
import type { FundingOrder } from '@lifi/sdk'
import { getFundingOrder } from '@lifi/sdk'
import { useSDKClient } from '@lifi/widget/shared'
import { useQueries } from '@tanstack/react-query'
import { useMemo } from 'react'
import type { CheckoutFundingSource } from '../stores/useCheckoutFlowStore.js'
import {
  listTrackedOrders,
  useFundingOrderStore,
} from '../stores/useFundingOrderStore.js'
import {
  fundingOrderQueryKey,
  type OrderPhase,
  orderPhase,
  orderRefetchInterval,
} from './useFundingOrder.js'

export interface ActivityItem {
  orderId: string
  fundingSource: CheckoutFundingSource
  order: FundingOrder | undefined
  phase: OrderPhase | undefined
  createdAt: number
}

// Fans out one poller per tracked order, sharing its query key (and cache
// entry) with `useFundingOrder` — the activity list and a resumed status
// page read the same in-flight fetch. Terminal orders stop polling but stay
// listed until the store's `acknowledge` retires them.
export function useCheckoutActivity(): ActivityItem[] {
  const sdkClient = useSDKClient()
  const orders = useFundingOrderStore((s) => s.orders)
  const tracked = useMemo(() => listTrackedOrders(orders, Date.now()), [orders])

  const results = useQueries({
    queries: tracked.map((order) => ({
      queryKey: fundingOrderQueryKey(order.orderId),
      queryFn: ({ signal }: { signal: AbortSignal }) =>
        getFundingOrder(sdkClient, order.orderId, undefined, { signal }),
      refetchInterval: (query: { state: { data?: FundingOrder } }) =>
        orderRefetchInterval(query.state.data?.status),
    })),
  })

  return tracked.map((trackedOrder, i) => {
    const order = results[i]?.data
    return {
      orderId: trackedOrder.orderId,
      fundingSource: trackedOrder.fundingSource,
      order,
      phase: orderPhase(order),
      createdAt: trackedOrder.createdAt,
    }
  })
}
