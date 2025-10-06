import type {
  CardProps,
  ComponentsOverrides,
  ComponentsVariants,
  SimplePaletteColorOptions,
  TabProps,
  TabsProps,
} from '@mui/material'
import type {} from '@mui/material/themeCssVarsAugmentation'
import type { CSSProperties } from 'react'
import type { NavigationProps } from '../types/widget.js'

// https://mui.com/customization/palette/
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
    routesContainer: CSSProperties
    chainSidebarContainer: CSSProperties
    header: CSSProperties
    navigation: NavigationProps
  }
  interface ThemeOptions {
    shape?: Partial<Shape>
    container?: CSSProperties
    routesContainer?: CSSProperties
    chainSidebarContainer?: CSSProperties
    header?: CSSProperties
    navigation?: NavigationProps
  }
  interface ComponentNameToClassKey {
    MuiInputCard: 'root'
    MuiNavigationTabs: 'root'
    MuiNavigationTab: 'root'
  }
  interface ComponentsPropsList {
    MuiInputCard: Partial<CardProps>
    MuiNavigationTabs: Partial<TabsProps>
    MuiNavigationTab: Partial<TabProps>
  }
  interface Components {
    MuiInputCard?: {
      defaultProps?: ComponentsPropsList['MuiInputCard']
      styleOverrides?: ComponentsOverrides<
        Omit<Theme, 'components'>
      >['MuiInputCard']
      variants?: ComponentsVariants['MuiInputCard']
    }
    MuiNavigationTabs?: {
      defaultProps?: ComponentsPropsList['MuiNavigationTabs']
      styleOverrides?: ComponentsOverrides<
        Omit<Theme, 'components'>
      >['MuiNavigationTabs']
      variants?: ComponentsVariants['MuiNavigationTabs']
    }
    MuiNavigationTab?: {
      defaultProps?: ComponentsPropsList['MuiNavigationTab']
      styleOverrides?: ComponentsOverrides<
        Omit<Theme, 'components'>
      >['MuiNavigationTab']
      variants?: ComponentsVariants['MuiNavigationTab']
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
