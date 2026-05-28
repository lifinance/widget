'use client'
import { useAccount } from '@lifi/wallet-management'
import {
  CheckoutContext,
  OnRampSessionsContext,
  type OnRampSessionsStore,
} from '@lifi/widget-provider/checkout'
import { useContext, useMemo } from 'react'
import { useStore } from 'zustand'
import { usePendingCheckoutStore } from '../stores/usePendingCheckoutStore.js'

// Immutable stub so useStore stays unconditional outside a provider.
const EMPTY_SESSIONS = Object.freeze({}) as Readonly<Record<string, never>>
const EMPTY_STATE = Object.freeze({ sessions: EMPTY_SESSIONS })
const EMPTY_STORE = {
  getState: () => EMPTY_STATE,
  getInitialState: () => EMPTY_STATE,
  setState: () => {},
  subscribe: () => () => {},
} as unknown as OnRampSessionsStore

export function useIsCheckoutBusy(): boolean {
  const contextStore = useContext(OnRampSessionsContext)
  const store = contextStore ?? EMPTY_STORE
  const sessionBusy = useStore(store, (s) =>
    Object.values(s.sessions).some((session) => session.isOpen)
  )
  const checkoutContext = useContext(CheckoutContext)
  const { accounts } = useAccount()
  const records = usePendingCheckoutStore((s) => s.records)
  const walletAddress = accounts.find(
    (a) => a.isConnected && a.address
  )?.address
  const integrator = checkoutContext?.integrator ?? null
  const resumeEnabled = checkoutContext?.resumePending !== false
  const hasLiveRecord = useMemo(() => {
    if (!integrator || !resumeEnabled) {
      return false
    }
    const now = Date.now()
    if (walletAddress) {
      const record = records[`${integrator}:${walletAddress}`]
      return Boolean(record) && record.expiresAt > now
    }
    const prefix = `${integrator}:`
    for (const [key, record] of Object.entries(records)) {
      if (!key.startsWith(prefix)) {
        continue
      }
      if (record.expiresAt > now) {
        return true
      }
    }
    return false
  }, [integrator, resumeEnabled, walletAddress, records])
  return sessionBusy || hasLiveRecord
}
