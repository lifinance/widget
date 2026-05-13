'use client'
import {
  type Context,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type { OnRampSession } from '../types.js'

interface OnRampSessionsRegistry {
  sessions: Record<string, OnRampSession>
  register: (id: string, session: OnRampSession) => void
  unregister: (id: string) => void
}

const noopRegister = () => {}
const noopUnregister = () => {}

export const OnRampSessionsContext: Context<OnRampSessionsRegistry> =
  createContext<OnRampSessionsRegistry>({
    sessions: {},
    register: noopRegister,
    unregister: noopUnregister,
  })

export interface OnRampSessionsRegistryValue {
  sessions: Record<string, OnRampSession>
  register: (id: string, session: OnRampSession) => void
  unregister: (id: string) => void
}

/**
 * Hook for on-ramp Hosts: registers their `OnRampSession` into the shared
 * registry under `id`. Re-runs when the memoized `session` object changes
 * (i.e. on every state update inside the Host), so consumers see fresh
 * state via the registry.
 */
export function useRegisterOnRampSession(
  id: string,
  session: OnRampSession
): void {
  const { register, unregister } = useContext(OnRampSessionsContext)
  useEffect(() => {
    register(id, session)
    return () => unregister(id)
  }, [id, session, register, unregister])
}

/** Reads the registered session for `id`, or `null` if none is mounted. */
export function useOnRampSession(id: string): OnRampSession | null {
  const { sessions } = useContext(OnRampSessionsContext)
  return sessions[id] ?? null
}

/**
 * Builds a stable `OnRampSessionsRegistry` value for the
 * `OnRampSessionsContext.Provider` to expose. Owned by the widget — every
 * Host descendant will register into it.
 */
export function useOnRampSessionsRegistry(): OnRampSessionsRegistryValue {
  const [sessions, setSessions] = useState<Record<string, OnRampSession>>({})

  const register = useCallback((id: string, session: OnRampSession) => {
    setSessions((prev) =>
      prev[id] === session ? prev : { ...prev, [id]: session }
    )
  }, [])

  const unregister = useCallback((id: string) => {
    setSessions((prev) => {
      if (!(id in prev)) {
        return prev
      }
      const next = { ...prev }
      delete next[id]
      return next
    })
  }, [])

  return useMemo(
    () => ({ sessions, register, unregister }),
    [sessions, register, unregister]
  )
}
