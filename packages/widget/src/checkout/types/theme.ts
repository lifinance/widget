import type { Components, PaletteOptions, Shape, Theme } from '@mui/material'
import type { TypographyVariantsOptions } from '@mui/material/styles'
import type { CSSProperties } from 'react'
import type { NavigationProps } from '../../types/widget.js'

export type CheckoutThemeComponents = Partial<
  Pick<
    Components<Theme>,
    | 'MuiAppBar'
    | 'MuiAvatar'
    | 'MuiButton'
    | 'MuiCard'
    | 'MuiIconButton'
    | 'MuiInput'
  >
>

export interface CheckoutTheme {
  colorSchemes?: {
    light?: {
      palette: PaletteOptions
    }
    dark?: {
      palette: PaletteOptions
    }
  }
  shape?: Partial<Shape>
  typography?: TypographyVariantsOptions
  components?: CheckoutThemeComponents
  container?: CSSProperties
  header?: CSSProperties
  navigation?: NavigationProps
}
