'use client'
import {
  OnRampSessionsContext,
  type OnRampSessionsStore,
} from '@lifi/widget-provider/checkout'
import { useContext } from 'react'
import { useStore } from 'zustand'

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
  return useStore(store, (s) =>
    Object.values(s.sessions).some((session) => session.isOpen)
  )
}
