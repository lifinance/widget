'use client'
import {
  OnRampSessionsContext,
  type OnRampSessionsStore,
} from '@lifi/widget-provider/checkout'
import { useContext } from 'react'
import { useStore } from 'zustand'
import { useCheckoutActivity } from './useCheckoutActivity.js'

// Mirrors the legacy pending-record TTL.
const BUSY_TTL_MS = 24 * 60 * 60 * 1000

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
  // Mirrors the old PendingRecord "live record" gate on the thin store: an
  // on-ramp session can self-close on payment success before its order
  // resolves server-side, so the close guard must stay up while a tracked
  // order is live-confirmed pending. Excludes INTENT_AWAITING_FUNDS (the
  // pre-funding substatus `useResumeCheckout` also keys off) so an order the
  // user created but never funded doesn't block closing for its whole
  // 7-day tracking retention — see useIsCheckoutBusy.test.tsx for the case
  // this guards against. `phase === undefined` (still loading, or errored
  // out after retries) is deliberately excluded too: unlike the old
  // synchronous localStorage read, a live fetch can be indeterminate, and
  // treating "unknown" as busy would block closing indefinitely on error.
  const items = useCheckoutActivity()
  const orderBusy = items.some(
    (item) =>
      item.phase === 'pending' &&
      item.order?.substatus !== 'INTENT_AWAITING_FUNDS' &&
      Date.now() - item.createdAt <= BUSY_TTL_MS
  )
  return sessionBusy || orderBusy
}
