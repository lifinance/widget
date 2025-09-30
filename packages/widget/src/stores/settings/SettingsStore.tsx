import {
  createContext,
  type PropsWithChildren,
  useContext,
  useRef,
} from 'react'
import type { StoreApi } from 'zustand'
import { useShallow } from 'zustand/shallow'
import type { UseBoundStoreWithEqualityFn } from 'zustand/traditional'
import { createSettingsStore } from './createSettingsStore.js'
import type { SettingsState, SettingsStoreProviderProps } from './types.js'

type SettingsStore = UseBoundStoreWithEqualityFn<StoreApi<SettingsState>>

const SettingsStoreContext = createContext<SettingsStore | null>(null)

export function SettingsStoreProvider({
  children,
  config,
}: PropsWithChildren<SettingsStoreProviderProps>) {
  const storeRef = useRef<SettingsStore>(null)
  if (!storeRef.current) {
    storeRef.current = createSettingsStore(config)
  }
  return (
    <SettingsStoreContext.Provider value={storeRef.current}>
      {children}
    </SettingsStoreContext.Provider>
  )
}

export function useSettingsStoreContext() {
  const useStore = useContext(SettingsStoreContext)
  if (!useStore) {
    throw new Error(
      'You forgot to wrap your component in SettingsStoreContext.'
    )
  }
  return useStore
}

export function useSettingsStore<T>(selector: (state: SettingsState) => T): T {
  const useStore = useSettingsStoreContext()
  return useStore(useShallow(selector))
}
