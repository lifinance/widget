import type {
  CardProps,
  ComponentsOverrides,
  ComponentsVariants,
  SimplePaletteColorOptions,
} from '@mui/material'
import type {} from '@mui/material/themeCssVarsAugmentation'
import type { CSSProperties } from 'react'
import type { NavigationProps } from '../types/widget.js'

// @mui/icons-material ESM issue
// https://github.com/mui/material-ui/issues/30671

// https://mui.com/customization/palette/

declare module 'react' {
  interface CSSProperties {
    listPageMaxHeight?: number
  }
}
declare module '@mui/material/styles' {
  interface TypographyVariants {
    '@supports (font-variation-settings: normal)': React.CSSProperties
  }
  interface TypographyVariantsOptions {
    '@supports (font-variation-settings: normal)'?: React.CSSProperties
  }
  interface Shape {
    borderRadius: number
    borderRadiusSecondary: number
    borderRadiusTertiary: number
  }
  interface Theme {
    shape: Shape
    container: CSSProperties
    header: CSSProperties
    navigation: NavigationProps
  }
  interface ThemeOptions {
    shape?: Partial<Shape>
    container?: CSSProperties
    header?: CSSProperties
    navigation?: NavigationProps
  }
  interface ComponentNameToClassKey {
    MuiInputCard: 'root'
  }
  interface ComponentsPropsList {
    MuiInputCard: Partial<CardProps>
  }
  interface Components {
    MuiInputCard?: {
      defaultProps?: ComponentsPropsList['MuiInputCard']
      styleOverrides?: ComponentsOverrides<
        Omit<Theme, 'components'>
      >['MuiInputCard']
      variants?: ComponentsVariants['MuiInputCard']
    }
  }
  interface Palette {
    playground: Palette['primary']
  }

  interface PaletteOptions {
    playground?: SimplePaletteColorOptions
  }
}

declare module '@mui/material/Paper' {
  interface PaperPropsVariantOverrides {
    filled: true
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    '@supports (font-variation-settings: normal)': true
  }
}
