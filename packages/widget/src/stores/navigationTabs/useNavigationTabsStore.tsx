import {
  createContext,
  type JSX,
  type PropsWithChildren,
  useContext,
  useRef,
} from 'react'
import { create } from 'zustand'
import { useShallow } from 'zustand/shallow'
import type {
  NavigationTabKey,
  SplitMode,
  WidgetConfig,
} from '../../types/widget.js'
import type { NavigationTabsState, NavigationTabsStore } from './types.js'
import {
  getInitialActiveTab,
  getNavigationTabKeys,
  getTabSplitMode,
} from './utils.js'

const NavigationTabsStoreContext = createContext<NavigationTabsStore | null>(
  null
)

export function NavigationTabsStoreProvider({
  children,
  config,
}: PropsWithChildren<{ config: WidgetConfig }>): JSX.Element {
  const tabs = getNavigationTabKeys(config)
  const initialActiveTab = getInitialActiveTab(config)
  // Recreate (re-seeding tabs + active tab) only when the config-driven inputs
  // change — not on runtime tab clicks, which must be preserved.
  const signature = `${tabs.join(',')}|${initialActiveTab ?? ''}`
  const storeRef = useRef<NavigationTabsStore>(null)
  const signatureRef = useRef(signature)
  if (!storeRef.current || signatureRef.current !== signature) {
    storeRef.current = createNavigationTabsStore(tabs, initialActiveTab)
    signatureRef.current = signature
  }
  return (
    <NavigationTabsStoreContext.Provider value={storeRef.current}>
      {children}
    </NavigationTabsStoreContext.Provider>
  )
}

function useNavigationTabsStoreContext(): NavigationTabsStore {
  const useStore = useContext(NavigationTabsStoreContext)
  if (!useStore) {
    throw new Error(
      `You forgot to wrap your component in <${NavigationTabsStoreProvider.name}>.`
    )
  }
  return useStore
}

export function useNavigationTabsStore<T>(
  selector: (state: NavigationTabsState) => T
): T {
  const useStore = useNavigationTabsStoreContext()
  return useStore(useShallow(selector))
}

/** Effective split mode derived from the active tab. */
export function useSplitMode(): SplitMode | undefined {
  return useNavigationTabsStore((state) => getTabSplitMode(state.activeTab))
}

const createNavigationTabsStore = (
  tabs: NavigationTabKey[],
  initialActiveTab?: NavigationTabKey
): NavigationTabsStore =>
  create<NavigationTabsState>((set) => ({
    tabs,
    activeTab: initialActiveTab,
    setActiveTab(activeTab) {
      set({ activeTab })
    },
  }))
