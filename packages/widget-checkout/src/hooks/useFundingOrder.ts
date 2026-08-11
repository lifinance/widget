'use client'
import type { FundingOrder } from '@lifi/sdk'
import { getFundingOrder } from '@lifi/sdk'
import { useSDKClient } from '@lifi/widget/shared'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

export const ORDER_POLLING_INTERVAL_MS = 10_000

export function fundingOrderQueryKey(
  orderId: string | null
): readonly unknown[] {
  return ['funding-order', orderId]
}

export type OrderPhase = 'pending' | 'done' | 'failed'

export function orderPhase(
  order: FundingOrder | undefined
): OrderPhase | undefined {
  if (!order) {
    return undefined
  }
  if (order.status === 'DONE') {
    return 'done'
  }
  if (order.status === 'FAILED') {
    return 'failed'
  }
  return 'pending'
}

export interface UseFundingOrderResult {
  order: FundingOrder | undefined
  phase: OrderPhase | undefined
  isLoading: boolean
  isError: boolean
  refetch: () => void
}

export function useFundingOrder(orderId: string | null): UseFundingOrderResult {
  const sdkClient = useSDKClient()
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: fundingOrderQueryKey(orderId),
    queryFn: ({ signal }) =>
      getFundingOrder(sdkClient, orderId as string, undefined, { signal }),
    enabled: Boolean(orderId),
    placeholderData: keepPreviousData,
    refetchInterval: (query) => {
      const status = query.state.data?.status
      if (status === 'DONE' || status === 'FAILED') {
        return false
      }
      return ORDER_POLLING_INTERVAL_MS
    },
  })
  return {
    order: data,
    phase: orderPhase(data),
    isLoading,
    isError,
    refetch: () => {
      void refetch()
    },
  }
}
