import {
  createContext,
  type JSX,
  type PropsWithChildren,
  useContext,
  useRef,
} from 'react'
import { create } from 'zustand'
import { useShallow } from 'zustand/shallow'
import type { ModeOptions, WidgetMode } from '../../types/widget.js'
import type {
  HeaderTab,
  HeaderTabsProps,
  HeaderTabsState,
  HeaderTabsStore,
} from './types.js'
import { useHeaderTabs } from './useHeaderTabs.js'
import { getDefaultTab } from './utils.js'

const HeaderTabsStoreContext = createContext<HeaderTabsStore | null>(null)

const shouldRecreateStore = (store: HeaderTabsStore, nextTabs: HeaderTab[]) => {
  const { tabs } = store.getState()
  if (tabs.length !== nextTabs.length) {
    return true
  }
  return tabs.some((tab, i) => tab.label !== nextTabs[i].label)
}

export function HeaderTabsStoreProvider({
  children,
  mode,
  modeOptions,
}: PropsWithChildren<HeaderTabsProps>): JSX.Element {
  const tabs = useHeaderTabs(mode)
  const storeRef = useRef<HeaderTabsStore>(null)
  if (!storeRef.current || shouldRecreateStore(storeRef.current, tabs)) {
    storeRef.current = createHeaderTabsStore(mode, modeOptions, tabs)
  }
  return (
    <HeaderTabsStoreContext.Provider value={storeRef.current}>
      {children}
    </HeaderTabsStoreContext.Provider>
  )
}

function useHeaderTabsStoreContext(): HeaderTabsStore {
  const useStore = useContext(HeaderTabsStoreContext)
  if (!useStore) {
    throw new Error(
      `You forgot to wrap your component in <${HeaderTabsStoreProvider.name}>.`
    )
  }
  return useStore
}

export function useHeaderTabsStore<T>(
  selector: (state: HeaderTabsState) => T
): T {
  const useStore = useHeaderTabsStoreContext()
  return useStore(useShallow(selector))
}

const createHeaderTabsStore = (
  mode: WidgetMode,
  modeOptions?: ModeOptions,
  tabs?: HeaderTab[]
) =>
  create<HeaderTabsState>((set) => ({
    activeTab: getDefaultTab(mode, modeOptions, tabs),
    tabs: tabs ?? [],
    setActiveTab(tab: HeaderTab) {
      set({ activeTab: tab })
    },
  }))
