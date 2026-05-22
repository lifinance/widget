import type { WidgetTheme } from '@lifi/widget'
import type { StoreApi, UseBoundStore } from 'zustand'
import type { Font } from '../../providers/FontLoaderProvider/types.js'
import type { WidgetEventName } from '../../utils/events.js'
import type { FormValues } from '../types.js'

export type Layout =
  | 'default'
  | 'restricted-height'
  | 'restricted-max-height'
  | 'full-height'

export interface ThemeItem {
  id: string
  name: string
  theme: WidgetTheme
}

export interface EditToolsValues {
  drawer: {
    open: boolean
  }
  fontControl: {
    selectedFont: Font | undefined // move to config
  }
  playgroundSettings: {
    viewportColorLight?: string | undefined
    viewportColorDark?: string | undefined
  }
  skeletonControl: {
    show: boolean
  }
  headerAndFooterControl: {
    showMockHeader: boolean
    showMockFooter: boolean
    isFooterFixed: boolean
  }
  layoutControl: {
    selectedLayoutId: Layout
  }
  isDevView: boolean
  widgetEventsControl: {
    allWidgetEventsOn: boolean
    monitoredEvents: Record<WidgetEventName, boolean>
  }
  formValues?: Partial<FormValues>
}

interface EditToolsActions {
  setDrawerOpen: (open: boolean) => void
  resetEditTools: () => void
  setSelectedFont: (font: Font) => void
  setViewportBackgroundColor: (
    color: string | undefined,
    mode: 'light' | 'dark'
  ) => void
  setSkeletonShow: (show: boolean) => void
  setHeaderVisibility: (show: boolean) => void
  setFooterVisibility: (show: boolean) => void
  setFixedFooter: (isFixed: boolean) => void
  setSelectedLayoutId: (layoutId: Layout) => void
  setIsDevView: (isDevView: boolean) => void
  setWidgetEventMonitors: (
    allWidgetEventsOn: boolean,
    monitoredEvents: Record<WidgetEventName, boolean>
  ) => void
  setFormValues: (formValues: FormValues) => void
}

export type ToolsState = EditToolsValues & EditToolsActions

export type ToolsStore = UseBoundStore<StoreApi<ToolsState>>
