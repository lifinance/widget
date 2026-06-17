'use client'
import { type Context, createContext, useContext, useEffect } from 'react'
import { useStore } from 'zustand'
import { createStore, type StoreApi } from 'zustand/vanilla'
import type { OnRampSession } from '../types.js'

interface OnRampSessionsState {
  sessions: Record<string, OnRampSession>
  register: (id: string, session: OnRampSession) => void
  unregister: (id: string) => void
}

export type OnRampSessionsStore = StoreApi<OnRampSessionsState>

/**
 * Creates a per-instance store that holds the registered `OnRampSession`s.
 * The widget owns one store per `<LifiWidgetCheckout>` mount; Hosts register
 * into it and consumers subscribe to specific session slots via selectors.
 */
export function createOnRampSessionsStore(): OnRampSessionsStore {
  return createStore<OnRampSessionsState>((set) => ({
    sessions: {},
    register: (id, session) =>
      set((s) =>
        s.sessions[id] === session
          ? s
          : { sessions: { ...s.sessions, [id]: session } }
      ),
    unregister: (id) =>
      set((s) => {
        if (!(id in s.sessions)) {
          return s
        }
        const { [id]: _, ...rest } = s.sessions
        return { sessions: rest }
      }),
  }))
}

export const OnRampSessionsContext: Context<OnRampSessionsStore | null> =
  createContext<OnRampSessionsStore | null>(null)

function useOnRampSessionsStore(): OnRampSessionsStore {
  const store = useContext(OnRampSessionsContext)
  if (!store) {
    throw new Error(
      'OnRampSessionsContext.Provider is missing — wrap descendants with <OnRampProviderRegistry>'
    )
  }
  return store
}

/**
 * Host hook: registers `session` under `id` for the lifetime of the mount.
 * Re-runs when the `session` reference changes so consumers always see the
 * latest state. CONTRACT: `session` must be memoized by the caller (see
 * `OnRampSession`) — an unmemoized object re-registers every render.
 */
export function useRegisterOnRampSession(
  id: string,
  session: OnRampSession
): void {
  const store = useOnRampSessionsStore()
  useEffect(() => {
    store.getState().register(id, session)
    return () => store.getState().unregister(id)
  }, [id, session, store])
}

/**
 * Consumer hook: subscribes to a single session slot. Re-renders only when
 * `sessions[id]` changes — other providers' updates do not trigger re-renders.
 */
export function useOnRampSession(id: string): OnRampSession | null {
  const store = useOnRampSessionsStore()
  return useStore(store, (s) => s.sessions[id] ?? null)
}
