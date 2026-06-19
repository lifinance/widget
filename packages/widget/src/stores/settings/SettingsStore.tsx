import {
  createContext,
  type JSX,
  type PropsWithChildren,
  use,
  useRef,
} from 'react'
import type { StoreApi, UseBoundStore } from 'zustand'
import { useShallow } from 'zustand/shallow'
import { createSettingsStore } from './createSettingsStore.js'
import type { SettingsState, SettingsStoreProviderProps } from './types.js'

type SettingsStore = UseBoundStore<StoreApi<SettingsState>>

const SettingsStoreContext = createContext<SettingsStore | null>(null)

export const SettingsStoreProvider = ({
  children,
  config,
}: PropsWithChildren<SettingsStoreProviderProps>): JSX.Element => {
  const storeRef = useRef<SettingsStore>(null)
  if (!storeRef.current) {
    storeRef.current = createSettingsStore(config)
  }
  return (
    <SettingsStoreContext value={storeRef.current}>
      {children}
    </SettingsStoreContext>
  )
}

export function useSettingsStoreContext(): any {
  const useStore = use(SettingsStoreContext)
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
