import type { Theme } from '@mui/material'

export const stripHexPrefix = (hex: string): string =>
  hex.replace(/^#/, '').toUpperCase()

/** Converts 3-digit hex colors to 6-digit (#abc -> #aabbcc). Needed because the color input breaks with 3-digit hex colors. */
export const safe6DigitHexColor = (color: string): string => {
  if (color.length === 4 && color.startsWith('#')) {
    return `#${color
      .substring(1)
      .split('')
      .map((hex: string) => hex + hex)
      .join('')}`
  }
  return color
}

/** Validates and normalizes a hex draft from the editable color input. */
export const parseEditableHex = (draft: string): string | null => {
  const cleaned = draft.replace(/[^0-9a-fA-F]/g, '')
  if (cleaned.length === 6 || cleaned.length === 3) {
    return safe6DigitHexColor(`#${cleaned}`)
  }
  return null
}

/** Returns a theme-aware background color for card fieldsets (light: 4% onBackground, dark: grey.800). */
export const getCardFieldsetBackgroundColor = (
  theme: Theme
): Record<string, any> => ({
  backgroundColor: `color-mix(in srgb, ${theme.vars.palette.common.onBackground} 4%, transparent)`,
  ...theme.applyStyles('dark', {
    backgroundColor: theme.vars.palette.grey[800],
  }),
})
