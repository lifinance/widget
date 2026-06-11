import type { StoreApi, UseBoundStore } from 'zustand'
import type { ModeOptions, WidgetMode } from '../../types/widget.js'

export interface HeaderTab {
  label: string
  mode: WidgetMode
  modeOptions?: ModeOptions
}

export interface HeaderTabsState {
  activeTab?: HeaderTab
  tabs: HeaderTab[]
  setActiveTab(tab: HeaderTab): void
}

export type HeaderTabsStore = UseBoundStore<StoreApi<HeaderTabsState>>

export interface HeaderTabsProps {
  mode: WidgetMode
  modeOptions?: ModeOptions
}
