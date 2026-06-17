import {
  createContext,
  type JSX,
  type PropsWithChildren,
  useContext,
  useRef,
} from 'react'
import { create } from 'zustand'
import { useShallow } from 'zustand/shallow'
import type { WidgetConfig } from '../../types/widget.js'
import type { JumperVariantState, JumperVariantStore } from './types.js'
import { getDefaultJumperTabKey } from './utils.js'

const JumperVariantStoreContext = createContext<JumperVariantStore | null>(null)

// State is populated only in the jumper variant; recreate the store when the
// variant changes so its populated-ness matches.
const shouldRecreateStore = (
  store: JumperVariantStore,
  isJumper: boolean
): boolean => (store.getState().state !== undefined) !== isJumper

export function JumperVariantStoreProvider({
  children,
  config,
}: PropsWithChildren<{ config: WidgetConfig }>): JSX.Element {
  const isJumper = config.variant === 'jumper'
  const storeRef = useRef<JumperVariantStore>(null)
  if (!storeRef.current || shouldRecreateStore(storeRef.current, isJumper)) {
    storeRef.current = createJumperVariantStore(isJumper)
  }
  return (
    <JumperVariantStoreContext.Provider value={storeRef.current}>
      {children}
    </JumperVariantStoreContext.Provider>
  )
}

function useJumperVariantStoreContext(): JumperVariantStore {
  const useStore = useContext(JumperVariantStoreContext)
  if (!useStore) {
    throw new Error(
      `You forgot to wrap your component in <${JumperVariantStoreProvider.name}>.`
    )
  }
  return useStore
}

export function useJumperVariantStore<T>(
  selector: (state: JumperVariantState) => T
): T {
  const useStore = useJumperVariantStoreContext()
  return useStore(useShallow(selector))
}

const createJumperVariantStore = (isJumper: boolean): JumperVariantStore =>
  create<JumperVariantState>((set) => ({
    state: isJumper
      ? { tier: 'simple', tabKey: getDefaultJumperTabKey('simple') }
      : undefined,
    setState(state) {
      set((s) => (s.state ? { state: { ...s.state, ...state } } : {}))
    },
  }))
