import type { Theme } from '@mui/material'

// Converts any 3 digit colors to 6 digit hex colors
// - needed as the color input breaks with 3 digit hex colors
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

export const getCardFieldsetBackgroundColor = (
  theme: Theme
): Record<string, any> => ({
  backgroundColor: `color-mix(in srgb, ${theme.vars.palette.common.onBackground} 4%, transparent)`,
  ...theme.applyStyles('dark', {
    backgroundColor: theme.vars.palette.grey[800],
  }),
})
