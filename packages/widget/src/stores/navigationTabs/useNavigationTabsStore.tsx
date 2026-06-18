import {
  createContext,
  type JSX,
  type PropsWithChildren,
  useContext,
  useMemo,
  useRef,
} from 'react'
import { create } from 'zustand'
import { useShallow } from 'zustand/shallow'
import {
  useWidgetConfig,
  WidgetContext,
} from '../../providers/WidgetProvider/WidgetProvider.js'
import type {
  NavigationTabKey,
  SplitMode,
  WidgetConfig,
} from '../../types/widget.js'
import type { NavigationTabsState, NavigationTabsStore } from './types.js'
import {
  getInitialActiveTab,
  getNavigationTabKeys,
  getTabMode,
  getTabModeOptions,
  getTabSplitMode,
  getTabVariant,
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
  let store = storeRef.current
  if (!store || signatureRef.current !== signature) {
    store = createNavigationTabsStore(tabs, initialActiveTab)
    storeRef.current = store
    signatureRef.current = signature
  }

  // Override the widget config with the active tab's mode, variant and
  // modeOptions (each falling back to the config), so the rest of the widget
  // reads tab-driven config transparently. No-op when there is no active tab.
  const widgetConfig = useWidgetConfig()
  const activeTab = store((state) => state.activeTab)
  const tabConfig = useMemo(() => {
    if (!activeTab) {
      return widgetConfig
    }
    return {
      ...widgetConfig,
      mode: getTabMode(widgetConfig, activeTab),
      variant: getTabVariant(widgetConfig, activeTab),
      modeOptions: getTabModeOptions(widgetConfig, activeTab),
    }
  }, [widgetConfig, activeTab])

  return (
    <NavigationTabsStoreContext.Provider value={store}>
      <WidgetContext.Provider value={tabConfig}>
        {children}
      </WidgetContext.Provider>
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
