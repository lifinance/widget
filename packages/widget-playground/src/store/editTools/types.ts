import type { WidgetTheme } from '@lifi/widget'
import type { StoreApi } from 'zustand'
import type { UseBoundStoreWithEqualityFn } from 'zustand/traditional'
import type { Font } from '../../providers/FontLoaderProvider/types'
import type { FormValues } from '../types'

type ControlType = 'design' | 'code'
type CodeControlTab = 'config' | 'examples'
export type Layout =
  | 'default'
  | 'restricted-height'
  | 'restricted-max-height'
  | 'full-height'

export type ThemeAppearances =
  | {
      light: WidgetTheme
    }
  | {
      dark: WidgetTheme
    }
  | {
      light: WidgetTheme
      dark: WidgetTheme
    }

interface ThemeAppearancesIndexable {
  [key: string]: WidgetTheme
}

export interface ThemeItem {
  id: string
  name: string
  theme: ThemeAppearances & ThemeAppearancesIndexable
}

export interface EditToolsValues {
  drawer: {
    open: boolean
    visibleControls: ControlType
    codeDrawerWidth: number
  }
  codeControl: {
    openTab: CodeControlTab
  }
  fontControl: {
    selectedFont: Font | undefined // move to config
  }
  playgroundSettings: {
    viewportColor?: string | undefined
  }
  skeletonControl: {
    show: boolean
    sideBySide: boolean
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
  formValues?: Partial<FormValues>
}

export interface EditToolsActions {
  setDrawerOpen: (open: boolean) => void
  setCodeDrawerWidth: (width: number) => void
  setVisibleControls: (controls: ControlType) => void
  setCodeControlTab: (tab: CodeControlTab) => void
  resetEditTools: () => void
  setSelectedFont: (font: Font) => void
  setViewportBackgroundColor: (color: string | undefined) => void
  setSkeletonShow: (show: boolean) => void
  setSkeletonSideBySide: (sideBySide: boolean) => void
  setHeaderVisibility: (show: boolean) => void
  setFooterVisibility: (show: boolean) => void
  setFixedFooter: (isFixed: boolean) => void
  setSelectedLayoutId: (layoutId: Layout) => void
  setIsDevView: (isDevView: boolean) => void
  setFormValues: (formValues: FormValues) => void
}

export type ToolsState = EditToolsValues & EditToolsActions

export type ToolsStore = UseBoundStoreWithEqualityFn<StoreApi<ToolsState>>
