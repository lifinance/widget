import type { StoreApi, UseBoundStore } from 'zustand'
import type { NavigationTabKey } from '../../types/widget.js'

export interface NavigationTabsState {
  /** Tabs to render in the header, resolved from config (empty when none). */
  tabs: NavigationTabKey[]
  /** Key of the active tab, or `undefined` when there are no tabs. */
  activeTab?: NavigationTabKey
  setActiveTab(activeTab: NavigationTabKey): void
}

export type NavigationTabsStore = UseBoundStore<StoreApi<NavigationTabsState>>
