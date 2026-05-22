import type { ThemeItem } from '../store/editTools/types.js'
import { safe6DigitHexColor } from './color.js'

export type PaletteMode = 'light' | 'dark'

export interface ThemeColorRowConfig {
  label: string
  suffix: string
}

export const PALETTE_COLOR_ROWS: ThemeColorRowConfig[] = [
  { label: 'Primary color', suffix: 'primary.main' },
  { label: 'Secondary color', suffix: 'secondary.main' },
  { label: 'Widget background', suffix: 'background.default' },
  { label: 'Card background', suffix: 'background.paper' },
  { label: 'Success', suffix: 'success.main' },
  { label: 'Warning', suffix: 'warning.main' },
  { label: 'Error', suffix: 'error.main' },
]

export const TYPOGRAPHY_COLOR_ROWS: ThemeColorRowConfig[] = [
  { label: 'Text primary', suffix: 'text.primary' },
  { label: 'Text secondary', suffix: 'text.secondary' },
]

export const ACCENT_SUFFIX: Record<PaletteMode, string> = {
  light: 'grey.300',
  dark: 'grey.800',
}

export const DEFAULT_VIEWPORT_BACKGROUND: Record<PaletteMode, string> = {
  light: '#F5F5F5',
  dark: '#000000',
}

export const getPaletteColorPath = (
  mode: PaletteMode,
  suffix: string
): string => `theme.colorSchemes.${mode}.palette.${suffix}`

export const getAccentColorPath = (mode: PaletteMode): string =>
  getPaletteColorPath(mode, ACCENT_SUFFIX[mode])

export const getThemeSchemeSupport = (
  colorSchemes: Record<string, unknown> | undefined
): {
  canLight: boolean
  canDark: boolean
  hasBothModes: boolean
} => {
  const schemeKeys = Object.keys(colorSchemes ?? {})
  const canLight = schemeKeys.includes('light')
  const canDark = schemeKeys.includes('dark')

  return {
    canLight,
    canDark,
    hasBothModes: canLight && canDark,
  }
}

export const getEffectivePaletteMode = (
  paletteMode: PaletteMode,
  canLight: boolean,
  canDark: boolean
): PaletteMode => {
  if (paletteMode === 'light' && !canLight && canDark) {
    return 'dark'
  }
  if (paletteMode === 'dark' && !canDark && canLight) {
    return 'light'
  }
  return paletteMode
}

export const getInitialPaletteMode = (
  canLight: boolean,
  canDark: boolean,
  themeMode: PaletteMode
): PaletteMode => {
  if (canLight && canDark) {
    return themeMode
  }
  return canLight ? 'light' : 'dark'
}

export const getViewportBackgroundHex = (
  mode: PaletteMode,
  viewportColorLight?: string,
  viewportColorDark?: string
): string =>
  safe6DigitHexColor(
    (mode === 'dark' ? viewportColorDark : viewportColorLight) ??
      DEFAULT_VIEWPORT_BACKGROUND[mode]
  ).toUpperCase()

export const getThemeViewportBackground = (
  mode: PaletteMode,
  selectedThemeItem: ThemeItem | undefined
): string =>
  selectedThemeItem?.theme.colorSchemes?.[mode]?.palette?.playground?.main ??
  DEFAULT_VIEWPORT_BACKGROUND[mode]

export const stripThemeNameSuffix = (name: string): string =>
  name.replace(/\s+Light$/i, '')

export const formatThemeDisplayName = (
  themeItem: ThemeItem,
  themeMode?: PaletteMode
): string => {
  const displayName = stripThemeNameSuffix(themeItem.name)
  const { hasBothModes } = getThemeSchemeSupport(themeItem.theme.colorSchemes)

  if (hasBothModes && themeMode) {
    return `${displayName} (${themeMode === 'dark' ? 'Dark' : 'Light'})`
  }

  return displayName
}

export const themeItemSupportsLight = (themeItem: ThemeItem): boolean => {
  const colorSchemeKeys = Object.keys(themeItem.theme.colorSchemes ?? {})
  return themeItem.id === 'default' || colorSchemeKeys.includes('light')
}

export const themeItemSupportsDark = (themeItem: ThemeItem): boolean => {
  const colorSchemeKeys = Object.keys(themeItem.theme.colorSchemes ?? {})
  return colorSchemeKeys.includes('dark')
}
