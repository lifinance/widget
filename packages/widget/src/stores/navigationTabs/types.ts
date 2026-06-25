import type { StoreApi, UseBoundStore } from 'zustand'
import type {
  DefaultUI,
  ModeOptions,
  NavigationTabKey,
  RequiredUIConfig,
  WidgetMode,
  WidgetVariant,
} from '../../types/widget.js'

export interface NavigationTab {
  /** Stable, language-independent identity; resolved to a label via a hook. */
  key: NavigationTabKey
  /** When omitted, the tab inherits `config.variant`. */
  variant?: WidgetVariant
  /** When omitted, the tab inherits `config.mode`. */
  mode?: WidgetMode
  modeOptions?: ModeOptions
  /** Layered over `config.defaultUI` while the tab is active. */
  defaultUI?: DefaultUI
  /** Layered over `config.requiredUI` while the tab is active. */
  requiredUI?: RequiredUIConfig
}

export interface NavigationTabsState {
  /** Tabs to render in the header, resolved from config (empty when none). */
  tabs: NavigationTabKey[]
  /** Key of the active tab, or `undefined` when there are no tabs. */
  activeTab?: NavigationTabKey
  setActiveTab(activeTab: NavigationTabKey): void
}

export type NavigationTabsStore = UseBoundStore<StoreApi<NavigationTabsState>>
