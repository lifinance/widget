import type {
  Appearance,
  WidgetConfig,
  WidgetSubvariant,
  WidgetTheme,
  WidgetVariant,
  WidgetWalletConfig,
} from '@lifi/widget'
import type { CSSProperties } from 'react'
import type { StoreApi } from 'zustand'
import type { UseBoundStoreWithEqualityFn } from 'zustand/traditional'
import type { ThemeItem } from '../editTools/types'
import type { FormValues } from '../types'

export interface WidgetConfigValues {
  defaultConfig?: Partial<WidgetConfig>
  config?: Partial<WidgetConfig>
  themeId: string
  widgetThemeItems: ThemeItem[]
}

export interface WidgetConfigActions {
  setConfig: (config: Partial<WidgetConfig>) => void
  setDefaultConfig: (defaultConfig: Partial<WidgetConfig>) => void
  resetConfig: () => void
  setAppearance: (appearance: Appearance) => void
  setVariant: (variant: WidgetVariant) => void
  setSubvariant: (subvariant: WidgetSubvariant) => void
  setBorderRadius: (radius: number) => void
  resetBorderRadius: () => void
  setBorderRadiusSecondary: (radius: number) => void
  resetBorderRadiusSecondary: () => void
  setColor: (path: string, color: string) => void
  setFontFamily: (fontName: string) => void
  setWalletConfig: (walletConfig?: WidgetWalletConfig) => void
  setConfigTheme: (theme: WidgetTheme, themeId: string) => void
  setAvailableThemes: (themeItems: ThemeItem[]) => void
  getCurrentThemePreset: (useDarkMode?: boolean) => WidgetTheme | undefined
  getCurrentConfigTheme: () => WidgetTheme | undefined
  setHeader: (header?: CSSProperties) => void
  setContainer: (container?: CSSProperties) => void
  setFormValues: (formValues: FormValues) => void
}

export type WidgetConfigState = WidgetConfigValues & WidgetConfigActions

export type WidgetConfigStore = UseBoundStoreWithEqualityFn<
  StoreApi<WidgetConfigState>
>
