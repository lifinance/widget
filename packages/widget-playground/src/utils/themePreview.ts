import type { Theme } from '@mui/material'
import type { ThemeItem } from '../store/editTools/types.js'

export const THEME_PREVIEW_LAYOUT = {
  width: 152,
  height: 100,
  borderRadius: 12,
  headerPill: {
    top: 8,
    width: 41,
    height: 8,
    borderRadius: 80,
  },
  card: {
    top: 22,
    width: 128,
    height: 46,
    borderRadius: 8,
  },
  cardText: {
    inset: 5.5,
    width: 16,
    height: 4,
    borderRadius: 80,
  },
  button: {
    top: 74,
    width: 128,
    height: 14,
    borderRadius: 16,
  },
} as const

/** Layered box-shadow stack for the theme card mini-preview outline. */
export const buildThemePreviewBoxShadow = (
  theme: Theme,
  outlineColor: string
): string => {
  const shadow = `color-mix(in srgb, ${theme.vars.palette.common.onBackground} 4%, transparent)`
  return [
    `0px 12px 12px -12px ${shadow}`,
    `0px 6px 6px -3px ${shadow}`,
    `0px 3px 3px -1.5px ${shadow}`,
    `0px 1px 1px -0.5px ${shadow}`,
    `0px 0px 0px 0.5px ${outlineColor}`,
  ].join(', ')
}

export interface PreviewColors {
  bg: string
  headerPill: string
  cardBg: string
  cardBorder: string
  cardText: string
  buttonColor: string
  outlineColor: string
}

const defaultPreviewColors: PreviewColors = {
  bg: '#fcfcfc',
  headerPill: '#c0c4cc',
  cardBg: '#ffffff',
  cardBorder: '#dde2eb',
  cardText: '#c0c4cc',
  buttonColor: '#5c67ff',
  outlineColor: '#dde2eb',
}

const getStringProp = (obj: unknown, key: string, fallback: string): string => {
  if (obj && typeof obj === 'object' && key in obj) {
    const value = (obj as Record<string, unknown>)[key]
    if (typeof value === 'string') {
      return value
    }
  }
  return fallback
}

/** Maps a theme item palette to the colors used by ThemePreviewMock. */
export const extractPreviewColors = (themeItem: ThemeItem): PreviewColors => {
  if (themeItem.id === 'default') {
    return defaultPreviewColors
  }

  const colorSchemes = themeItem.theme.colorSchemes
  const palette =
    colorSchemes?.light?.palette ||
    colorSchemes?.dark?.palette ||
    Object.values(colorSchemes ?? {})[0]?.palette

  const buttonColor = getStringProp(palette?.primary, 'main', '#5c67ff')
  const divider = getStringProp(palette, 'divider', '#dde2eb')
  const bg = getStringProp(palette?.background, 'default', '#fcfcfc')
  const cardBg = getStringProp(palette?.background, 'paper', '#ffffff')
  const headerPill = getStringProp(palette?.grey, '300', '#c0c4cc')

  return {
    bg,
    headerPill,
    cardBg,
    cardBorder: divider,
    cardText: headerPill,
    buttonColor,
    outlineColor: divider,
  }
}
