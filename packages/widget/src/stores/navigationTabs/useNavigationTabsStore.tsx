import {
  createContext,
  type JSX,
  type PropsWithChildren,
  use,
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
import { getSplitMode } from '../../utils/mode.js'
import type { NavigationTabsState, NavigationTabsStore } from './types.js'
import { getInitialActiveTab, getNavigationTabs } from './utils.js'

const NavigationTabsStoreContext = createContext<NavigationTabsStore | null>(
  null
)

export function NavigationTabsStoreProvider({
  children,
  config,
}: PropsWithChildren<{ config: WidgetConfig }>): JSX.Element {
  const navigationTabs = getNavigationTabs(config)
  const tabs = navigationTabs.map((tab) => tab.tabKey)
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

  // Layer the active tab's config overrides on top of the widget config, so the
  // rest of the widget reads tab-driven config transparently. Omitted fields
  // fall back to the widget config. No-op when there is no active tab.
  const widgetConfig = useWidgetConfig()
  const activeTab = store((state) => state.activeTab)
  const tabConfig = useMemo(() => {
    const activeConfig = navigationTabs.find(
      (tab) => tab.tabKey === activeTab
    )?.config
    if (!activeConfig) {
      return widgetConfig
    }
    return { ...widgetConfig, ...activeConfig }
  }, [widgetConfig, activeTab, navigationTabs])

  return (
    <NavigationTabsStoreContext value={store}>
      <WidgetContext value={tabConfig}>{children}</WidgetContext>
    </NavigationTabsStoreContext>
  )
}

function useNavigationTabsStoreContext(): NavigationTabsStore {
  const useStore = use(NavigationTabsStoreContext)
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

/** Effective split mode derived from the active tab's resolved config. */
export function useSplitMode(): SplitMode | undefined {
  const activeTab = useNavigationTabsStore((state) => state.activeTab)
  const config = useWidgetConfig()
  if (!activeTab) {
    return undefined
  }
  return config.mode === 'split'
    ? getSplitMode(config.modeOptions?.split)
    : undefined
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
