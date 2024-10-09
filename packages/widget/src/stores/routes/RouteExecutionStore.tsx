import { createContext, useContext, useRef } from 'react'
import type { StoreApi } from 'zustand'
import type { UseBoundStoreWithEqualityFn } from 'zustand/traditional'
import type { PersistStoreProviderProps } from '../types.js'
import { createRouteExecutionStore } from './createRouteExecutionStore.js'
import type { RouteExecutionState } from './types.js'

export type RouteExecutionStore = UseBoundStoreWithEqualityFn<
  StoreApi<RouteExecutionState>
>

export const RouteExecutionStoreContext =
  createContext<RouteExecutionStore | null>(null)

export function RouteExecutionStoreProvider({
  children,
  ...props
}: PersistStoreProviderProps) {
  const storeRef = useRef<RouteExecutionStore>()
  if (!storeRef.current) {
    storeRef.current = createRouteExecutionStore(props)
  }
  return (
    <RouteExecutionStoreContext.Provider value={storeRef.current}>
      {children}
    </RouteExecutionStoreContext.Provider>
  )
}

export function useRouteExecutionStoreContext() {
  const useStore = useContext(RouteExecutionStoreContext)
  if (!useStore) {
    throw new Error(
      `You forgot to wrap your component in <${RouteExecutionStoreProvider.name}>.`
    )
  }
  return useStore
}

export function useRouteExecutionStore<T>(
  selector: (state: RouteExecutionState) => T,
  equalityFn?: (left: T, right: T) => boolean
): T {
  const useStore = useRouteExecutionStoreContext()
  return useStore(selector, equalityFn)
}
