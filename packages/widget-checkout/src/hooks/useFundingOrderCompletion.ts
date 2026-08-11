'use client'
import type { FundingOrder } from '@lifi/sdk'
import { useCheckoutConfig } from '@lifi/widget-provider/checkout'
import { useContext, useEffect } from 'react'
import { useStore } from 'zustand'
import {
  type CheckoutFlowStore,
  CheckoutFlowStoreContext,
} from '../stores/useCheckoutFlowStore.js'

// Terminal callbacks fire once per orderId per session, surviving remounts.
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
  order: FundingOrder | undefined
): void {
  const { onSuccess, onError } = useCheckoutConfig()
  const flowStore = useContext(CheckoutFlowStoreContext) ?? NO_FLOW_STORE
  const fundingSource = useStore(
    flowStore,
    (s: { fundingSource: string | null }) => s.fundingSource
  )

  useEffect(() => {
    if (!order || firedOrderIds.has(order.orderId)) {
      return
    }
    if (order.status === 'DONE') {
      firedOrderIds.add(order.orderId)
      onSuccess?.({
        provider: fundingSource ?? 'checkout',
        transactionHash: order.result?.toTxHash,
        amount: order.result?.toAmount ?? '',
        token: order.destination.toTokenAddress,
        chainId: order.destination.toChainId,
        depositAddress: order.depositAddress,
      })
    } else if (order.status === 'FAILED') {
      firedOrderIds.add(order.orderId)
      onError?.({
        code: order.substatus ?? 'ORDER_FAILED',
        message: `Funding order ${order.orderId} failed.`,
        provider: fundingSource ?? 'checkout',
      })
    }
  }, [order, onSuccess, onError, fundingSource])
}
