import { createContext, type JSX, useContext, useRef } from 'react'
import { create } from 'zustand'
import { useShallow } from 'zustand/shallow'
import type {
  SplitModeProps,
  SplitModeProviderProps,
  SplitModeState,
  SplitModeStore,
} from './types.js'

const SplitModeStoreContext = createContext<SplitModeStore | null>(null)

const shouldRecreateStore = (store: SplitModeStore, props: SplitModeProps) => {
  const { state } = store.getState()
  return state !== props.state
}

export function SplitModeStoreProvider({
  children,
  ...props
}: SplitModeProviderProps): JSX.Element {
  const storeRef = useRef<SplitModeStore>(null)
  if (!storeRef.current || shouldRecreateStore(storeRef.current, props)) {
    storeRef.current = createSplitModeStore(props)
  }
  return (
    <SplitModeStoreContext.Provider value={storeRef.current}>
      {children}
    </SplitModeStoreContext.Provider>
  )
}

function useSplitModeStoreContext() {
  const useStore = useContext(SplitModeStoreContext)
  if (!useStore) {
    throw new Error(
      `You forgot to wrap your component in <${SplitModeStoreProvider.name}>.`
    )
  }
  return useStore
}

export function useSplitModeStore<T>(
  selector: (state: SplitModeState) => T
): T {
  const useStore = useSplitModeStoreContext()
  return useStore(useShallow(selector))
}

const createSplitModeStore = ({ state }: SplitModeProps) =>
  create<SplitModeState>((set) => ({
    state,
    setState(state) {
      set(() => ({
        state,
      }))
    },
  }))
