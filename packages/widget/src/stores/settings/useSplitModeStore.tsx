import { createContext, type JSX, useContext, useRef } from 'react'
import { create } from 'zustand'
import { useShallow } from 'zustand/shallow'
import { getSplitMode } from '../../utils/mode.js'
import { useJumperVariantStore } from '../jumperVariant/useJumperVariantStore.js'
import { getJumperTab } from '../jumperVariant/utils.js'
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
  config,
}: SplitModeProviderProps): JSX.Element {
  const tabKey = useJumperVariantStore((state) => state.state?.tabKey)
  const jumperTab = tabKey ? getJumperTab(tabKey) : undefined
  const state =
    config.variant === 'jumper'
      ? jumperTab?.mode === 'split'
        ? getSplitMode(jumperTab.modeOptions?.split)
        : undefined
      : config.mode === 'split'
        ? getSplitMode(config.modeOptions?.split)
        : undefined
  const storeRef = useRef<SplitModeStore>(null)
  if (!storeRef.current || shouldRecreateStore(storeRef.current, { state })) {
    storeRef.current = createSplitModeStore({ state })
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
