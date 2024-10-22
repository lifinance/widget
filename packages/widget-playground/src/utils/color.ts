import type { Theme } from '@mui/material'
import { alpha } from '@mui/material/styles'

// Converts any 3 digit colors to 6 digit hex colors
// - needed as the color input breaks with 3 digit hex colors
export const safe6DigitHexColor = (color: string) => {
  if (color.length === 4 && color.startsWith('#')) {
    return `#${color
      .substring(1)
      .split('')
      .map((hex: string) => hex + hex)
      .join('')}`
  }
  return color
}

export const getCardFieldsetBackgroundColor = (theme: Theme) =>
  theme.palette.mode === 'dark'
    ? theme.palette.grey[800]
    : alpha(theme.palette.common.black, 0.04)
