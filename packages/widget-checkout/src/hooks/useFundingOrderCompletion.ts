'use client'
import type { FundingOrder } from '@lifi/sdk'
import { useCheckoutConfig } from '@lifi/widget-provider/checkout'
import { useContext, useEffect } from 'react'
import { useStore } from 'zustand'
import {
  type CheckoutFlowStore,
  CheckoutFlowStoreContext,
} from '../stores/useCheckoutFlowStore.js'
import { useFundingOrderStore } from '../stores/useFundingOrderStore.js'

// In-session guard; the persisted `completed` record below carries it across
// reloads, because a terminal order stays tracked (and re-observed) until
// something acknowledges it.
const firedOrderIds = new Set<string>()

// Stub so useStore stays unconditional when rendered outside the flow provider.
const NO_FLOW_STATE = Object.freeze({ fundingSource: null })
const NO_FLOW_STORE = {
  getState: () => NO_FLOW_STATE,
  getInitialState: () => NO_FLOW_STATE,
  setState: () => {},
  subscribe: () => () => {},
} as unknown as CheckoutFlowStore

export function useFundingOrderCompletion(
  order: FundingOrder | undefined,
  // The layout observer watches orders from other flows, where the live flow
  // store no longer describes this order — it passes the tracked source.
  fundingSourceOverride?: string | null
): void {
  const { onSuccess, onError } = useCheckoutConfig()
  const flowStore = useContext(CheckoutFlowStoreContext) ?? NO_FLOW_STORE
  const liveFundingSource = useStore(
    flowStore,
    (s: { fundingSource: string | null }) => s.fundingSource
  )
  const fundingSource = fundingSourceOverride ?? liveFundingSource

  useEffect(() => {
    if (!order || firedOrderIds.has(order.orderId)) {
      return
    }
    const { completed, markCompleted } = useFundingOrderStore.getState()
    if (completed?.[order.orderId]) {
      return
    }
    const fireOnce = (): void => {
      firedOrderIds.add(order.orderId)
      markCompleted(order.orderId)
    }
    if (order.status === 'DONE') {
      fireOnce()
      onSuccess?.({
        provider: fundingSource ?? 'checkout',
        transactionHash: order.result?.toTxHash,
        amount: order.result?.toAmount ?? '',
        token: order.destination.toTokenAddress,
        chainId: order.destination.toChainId,
        depositAddress: order.depositAddress,
      })
    } else if (order.status === 'FAILED') {
      fireOnce()
      onError?.({
        code: order.substatus ?? 'ORDER_FAILED',
        message: `Funding order ${order.orderId} failed.`,
        provider: fundingSource ?? 'checkout',
      })
    }
  }, [order, onSuccess, onError, fundingSource])
}
