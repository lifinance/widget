'use client'
import { useCheckoutConfig } from '@lifi/widget-provider/checkout'
import { useContext, useMemo } from 'react'
import { useStore } from 'zustand'
import {
  type CheckoutFlowStore,
  CheckoutFlowStoreContext,
} from '../stores/useCheckoutFlowStore.js'
import {
  buildResumeKey,
  type PendingRecord,
  usePendingCheckoutStore,
} from '../stores/usePendingCheckoutStore.js'

// Stub so useStore stays unconditional when rendered outside the flow provider.
const NO_FLOW_STATE = Object.freeze({ frozenDepositId: null })
const NO_FLOW_STORE = {
  getState: () => NO_FLOW_STATE,
  getInitialState: () => NO_FLOW_STATE,
  setState: () => {},
  subscribe: () => () => {},
} as unknown as CheckoutFlowStore

export function useResumeKey(): string | null {
  const { integrator } = useCheckoutConfig()
  const flowStore = useContext(CheckoutFlowStoreContext) ?? NO_FLOW_STORE
  const frozenDepositId = useStore(flowStore, (s) => s.frozenDepositId)
  return frozenDepositId ? buildResumeKey(integrator, frozenDepositId) : null
}

export function useResumeRecord(): PendingRecord | null {
  const key = useResumeKey()
  const records = usePendingCheckoutStore((s) => s.records)
  return useMemo(() => {
    if (!key) {
      return null
    }
    const record = records[key]
    if (!record || record.expiresAt <= Date.now()) {
      return null
    }
    return record
  }, [key, records])
}
