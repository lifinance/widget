import type {
  CSSObject,
  Shape,
  SimplePaletteColorOptions,
  Theme,
} from '@mui/material'
import {
  alpha,
  buttonClasses,
  createTheme as createMuiTheme,
  css,
  darken,
  keyframes,
  lighten,
  tabsClasses,
  touchRippleClasses,
} from '@mui/material'
import type { WidgetTheme } from '../types/widget.js'
import { palette, paletteDark, paletteLight } from './palettes.js'
import type {} from './types.js'
import { getStyleOverrides } from './utils.js'

const zeroCssValuePattern = /^0(?:[a-z%]+)?$/i

const isZeroCssValue = (value: string | number | undefined): boolean => {
  if (value === undefined) {
    return false
  }

  if (typeof value === 'number') {
    return value === 0
  }

  return zeroCssValuePattern.test(value.trim())
}

const hasZeroHorizontalPadding = (header?: WidgetTheme['header']): boolean => {
  if (!header) {
    return false
  }

  const explicitHorizontalValues = [
    header.paddingInlineStart,
    header.paddingLeft,
    header.paddingInlineEnd,
    header.paddingRight,
  ].filter((value) => value !== undefined)

  if (explicitHorizontalValues.length) {
    return explicitHorizontalValues.every((value) => isZeroCssValue(value))
  }

  const shorthand = header.paddingInline ?? header.padding

  if (shorthand === undefined) {
    return false
  }

  if (typeof shorthand === 'number') {
    return shorthand === 0
  }

  const parts = shorthand.trim().split(/\s+/).filter(Boolean)

  if (parts.length === 0) {
    return false
  }

  const horizontalParts =
    parts.length === 1
      ? [parts[0]]
      : parts.length === 2 || parts.length === 3
        ? [parts[1]]
        : [parts[1], parts[3]]

  return horizontalParts.every((value) => isZeroCssValue(value))
}

const shape: Shape = {
  borderRadius: 12,
  borderRadiusSecondary: 12,
  borderRadiusTertiary: 24,
}

const enterKeyframe = keyframes`
  0% {
    transform: scale(0);
    opacity: 0.05;
  }
  100% {
    transform: scale(1);
    opacity: 0.1;
  }
`

export const createTheme = (widgetTheme: WidgetTheme = {}): Theme => {
  const configuredPaletteLight = widgetTheme.colorSchemes?.light?.palette
  const configuredPaletteDark = widgetTheme.colorSchemes?.dark?.palette

  const primaryMainColorLight =
    (configuredPaletteLight?.primary as SimplePaletteColorOptions)?.main ??
    palette.primary.main
  const primaryMainColorDark =
    (configuredPaletteDark?.primary as SimplePaletteColorOptions)?.main ??
    palette.primary.main

  const primaryLightenColorLight = lighten(primaryMainColorLight, 0.84)
  const primaryDarkenColorLight = darken(primaryMainColorLight, 0.2)
  const primaryLightenColorDark =
    primaryMainColorLight === primaryMainColorDark
      ? primaryLightenColorLight
      : lighten(primaryMainColorDark, 0.84)
  const primaryDarkenColorDark =
    primaryMainColorLight === primaryMainColorDark
      ? primaryDarkenColorLight
      : darken(primaryMainColorDark, 0.2)

  const secondaryMainColorLight =
    (configuredPaletteLight?.secondary as SimplePaletteColorOptions)?.main ??
    palette.secondary.main
  const secondaryMainColorDark =
    (configuredPaletteDark?.secondary as SimplePaletteColorOptions)?.main ??
    palette.secondary.main

  const secondaryLightenColorLight = lighten(secondaryMainColorLight, 0.84)
  const secondaryDarkenColorLight = darken(secondaryMainColorLight, 0.2)
  const secondaryLightenColorDark =
    secondaryMainColorLight === secondaryMainColorDark
      ? secondaryLightenColorLight
      : lighten(secondaryMainColorDark, 0.84)
  const secondaryDarkenColorDark =
    secondaryMainColorLight === secondaryMainColorDark
      ? secondaryDarkenColorLight
      : darken(secondaryMainColorDark, 0.2)

  const theme = createMuiTheme({
    cssVariables: {
      cssVarPrefix: 'lifi',
      colorSchemeSelector: 'class',
      nativeColor: true,
    },
    colorSchemes: {
      light: {
        palette: {
          ...palette,
          ...paletteLight,
          ...widgetTheme.colorSchemes?.light?.palette,
          primary: {
            main: primaryMainColorLight,
            light: primaryLightenColorLight,
            dark: primaryDarkenColorLight,
          },
          secondary: {
            main: secondaryMainColorLight,
            light: secondaryLightenColorLight,
            dark: secondaryDarkenColorLight,
          },
        },
      },
      dark: {
        palette: {
          ...palette,
          ...paletteDark,
          ...widgetTheme.colorSchemes?.dark?.palette,
          primary: {
            main: primaryMainColorDark,
            light: primaryLightenColorDark,
            dark: primaryDarkenColorDark,
          },
          secondary: {
            main: secondaryMainColorDark,
            light: secondaryLightenColorDark,
            dark: secondaryDarkenColorDark,
          },
        },
      },
    },
    container: widgetTheme.container,
    pageContainer: widgetTheme.pageContainer,
    routesContainer: widgetTheme.routesContainer,
    chainSidebarContainer: widgetTheme.chainSidebarContainer,
    header: widgetTheme.header,
    navigation: {
      edge:
        widgetTheme.navigation?.edge ??
        !hasZeroHorizontalPadding(widgetTheme.header),
      ...widgetTheme.navigation,
    },
    typography: {
      fontFamily: 'Inter, sans-serif',
      ...widgetTheme.typography,
    },
    shape: {
      ...shape,
      ...widgetTheme.shape,
    },
    breakpoints: {
      values: {
        xs: 360,
        sm: 416,
        md: 900,
        lg: 1200,
        xl: 1536,
      },
    },
    components: {
      MuiScopedCssBaseline: {
        styleOverrides: {
          root: {
            fontFamily: 'Inter, sans-serif',
            ...widgetTheme.typography,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: ({ ownerState }) => ({
            minHeight: 40,
            padding: 0,
            ...getStyleOverrides('MuiAppBar', 'root', widgetTheme, ownerState),
          }),
        },
      },
      MuiCard: {
        defaultProps: {
          variant: 'outlined',
          ...widgetTheme.components?.MuiCard?.defaultProps,
        },
        styleOverrides: {
          root: ({ ownerState, theme }) => {
            const root = widgetTheme.components?.MuiCard?.styleOverrides
              ?.root as CSSObject
            const rootHover = root?.['&:hover']
            return {
              backgroundColor: theme.vars.palette.background.paper,
              backgroundImage: 'none',
              borderRadius: theme.vars.shape.borderRadius,
              overflow: 'hidden',
              position: 'relative',
              boxSizing: 'border-box',
              transition: theme.transitions.create(
                ['background-color', 'filter'],
                {
                  duration: theme.transitions.duration.enteringScreen,
                  easing: theme.transitions.easing.easeOut,
                }
              ),
              ...(!!ownerState.onClick && {
                '&:hover': {
                  cursor: 'pointer',
                },
              }),
              ...(!!ownerState.onClick &&
                (ownerState.variant === 'outlined' ||
                  ownerState.variant === 'filled') && {
                  '&:hover': {
                    cursor: 'pointer',
                    backgroundColor: `color-mix(in srgb, ${theme.vars.palette.background.paper} 98%, black)`,
                    ...theme.applyStyles('dark', {
                      backgroundColor: `color-mix(in srgb, ${theme.vars.palette.background.paper} 98%, white)`,
                    }),
                  },
                }),
              ...(!!ownerState.onClick &&
                ownerState.variant === 'elevation' && {
                  '&:hover': {
                    cursor: 'pointer',
                    filter: `drop-shadow(0 1px 4px color-mix(in srgb, ${theme.vars.palette.common.onBackground} 8%, transparent))`,
                    ...theme.applyStyles('dark', {
                      filter: `drop-shadow(0 1px 4px color-mix(in srgb, ${theme.vars.palette.common.background} 8%, transparent))`,
                    }),
                  },
                }),
              ...(typeof root === 'object' && root),
              ...(!!ownerState.onClick &&
                !!rootHover && {
                  '&:hover': {
                    ...rootHover,
                    ...theme.applyStyles('dark', {
                      ...rootHover,
                    }),
                  },
                }),
              ...(!ownerState.onClick && {
                '&:hover': {},
              }),
            }
          },
        },
        variants: widgetTheme.components?.MuiCard?.variants ?? [
          {
            props: { variant: 'outlined' },
            style: ({ theme }) => ({
              borderWidth: 1,
              borderStyle: 'solid',
              borderColor: theme.vars.palette.grey[300],
              ...theme.applyStyles('dark', {
                borderColor: theme.vars.palette.grey[800],
              }),
            }),
          },
          {
            props: { variant: 'elevation' },
            style: ({ theme }) => ({
              border: 'none',
              boxShadow: 'none',
              filter: `drop-shadow(0 1px 4px color-mix(in srgb, ${theme.vars.palette.common.onBackground} 4%, transparent))`,
              ...theme.applyStyles('dark', {
                filter: `drop-shadow(0 1px 4px color-mix(in srgb, ${theme.vars.palette.common.background} 4%, transparent))`,
              }),
            }),
          },
          {
            props: { variant: 'filled' },
            style: {
              border: 'none',
            },
          },
        ],
      },
      MuiInputCard: {
        ...widgetTheme.components?.MuiInputCard,
      },
      MuiButtonBase: {
        styleOverrides: {
          // This `css()` function invokes keyframes. `styled-components` only supports keyframes
          // in string templates. Do not convert these styles in JS object as it will break.
          root: css`
            &
              .${touchRippleClasses.ripple}.${touchRippleClasses.rippleVisible} {
              opacity: 0.1;
              animation-name: ${enterKeyframe};
            }
          `,
        },
      },
      MuiButton: {
        defaultProps: {
          disableElevation: true,
          ...widgetTheme.components?.MuiButton?.defaultProps,
        },
        styleOverrides: {
          root: ({ theme, ownerState }) => ({
            borderRadius: theme.vars.shape.borderRadiusSecondary,
            textTransform: 'none',
            fontSize: 16,
            fontWeight: 600,
            '&.Mui-disabled, &.Mui-disabled:hover': {
              color: `color-mix(in srgb, ${theme.vars.palette.common.onBackground} 56%, transparent)`,
              cursor: 'not-allowed',
              pointerEvents: 'auto',
            },
            [`&.${buttonClasses.loading}.Mui-disabled`]: {
              backgroundColor: theme.vars.palette.primary.main,
              color: theme.palette.getContrastText(theme.palette.primary.main),
              cursor: 'auto',
              pointerEvents: 'auto',
            },
            [`.${buttonClasses.loadingIndicator}`]: {
              color: theme.palette.getContrastText(theme.palette.primary.main),
            },
            [`&.${buttonClasses.root}.${buttonClasses.loading}`]: {
              color: 'transparent',
            },
            ...getStyleOverrides('MuiButton', 'root', widgetTheme, ownerState),
          }),
          text: ({ theme, ownerState }) => ({
            backgroundColor: `color-mix(in srgb, ${theme.vars.palette.primary.main} 8%, transparent)`,
            color: theme.vars.palette.primary.main,
            '&:hover': {
              backgroundColor: `color-mix(in srgb, ${theme.vars.palette.primary.main} 12%, transparent)`,
            },
            ...theme.applyStyles('dark', {
              backgroundColor: `color-mix(in srgb, ${theme.vars.palette.primary.main} 42%, transparent)`,
              color: theme.palette.getContrastText(
                alpha(theme.palette.primary.main, 0.08)
              ),
              '&:hover': {
                backgroundColor: `color-mix(in srgb, ${theme.vars.palette.primary.main} 56%, transparent)`,
              },
            }),
            ...getStyleOverrides('MuiButton', 'text', widgetTheme, ownerState),
          }),
          contained: ({ ownerState }) => ({
            '&:hover': {
              color: theme.palette.getContrastText(theme.palette.primary.main),
            },
            ...getStyleOverrides(
              'MuiButton',
              'contained',
              widgetTheme,
              ownerState
            ),
          }),
          sizeMedium: ({ ownerState }) => ({
            padding: '10px 14px',
            ...getStyleOverrides(
              'MuiButton',
              'sizeMedium',
              widgetTheme,
              ownerState
            ),
          }),
        },
      },
      MuiIconButton: {
        ...widgetTheme.components?.MuiIconButton,
        styleOverrides: {
          ...widgetTheme.components?.MuiIconButton?.styleOverrides,
          root: ({ ownerState }) => ({
            color: 'inherit',
            '&:hover': {
              color: 'inherit',
            },
            ...getStyleOverrides(
              'MuiIconButton',
              'root',
              widgetTheme,
              ownerState
            ),
          }),
        },
      },
      MuiAvatar: {
        styleOverrides: {
          root: {
            height: 40,
            width: 40,
          },
          img: {
            objectFit: 'contain',
          },
        },
        ...widgetTheme.components?.MuiAvatar,
      },
      MuiListItemText: {
        styleOverrides: {
          primary: ({ theme }) => ({
            fontWeight: 600,
            fontSize: '1.125rem',
            lineHeight: '1.2778',
            color: theme.vars.palette.text.primary,
          }),
          secondary: ({ theme }) => ({
            fontWeight: 500,
            fontSize: '0.75rem',
            color: theme.vars.palette.text.secondary,
          }),
        },
      },
      MuiTooltip: {
        defaultProps: {
          enterDelay: 400,
          disableInteractive: true,
          arrow: true,
          placement: 'top',
        },
        styleOverrides: {
          tooltip: ({ theme }) => ({
            backgroundColor: 'rgb(0 0 0 / 64%)',
            backdropFilter: 'blur(3px)',
            fontSize: '0.75rem',
            padding: theme.spacing(1, 1.5),
          }),
          arrow: {
            color: 'rgb(0 0 0 / 64%)',
          },
        },
      },
      MuiMenu: {
        styleOverrides: {
          paper: ({ theme }) => ({
            backgroundColor: theme.vars.palette.background.paper,
            backgroundImage: 'none',
          }),
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundImage: 'none',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiTabs: {
        ...widgetTheme.components?.MuiTabs,
        styleOverrides: {
          ...widgetTheme.components?.MuiTabs?.styleOverrides,
          root: ({ theme, ownerState }) => {
            const rootStyleOverrides = getStyleOverrides(
              'MuiTabs',
              'root',
              widgetTheme,
              ownerState
            )
            return {
              backgroundColor: `color-mix(in srgb, ${theme.vars.palette.common.onBackground} 4%, transparent)`,
              ...theme.applyStyles('dark', {
                backgroundColor: `color-mix(in srgb, ${theme.vars.palette.common.onBackground} 8%, transparent)`,
              }),
              borderRadius: theme.vars.shape.borderRadius,
              ...rootStyleOverrides,
              [`.${tabsClasses.indicator}`]: {
                backgroundColor: theme.vars.palette.background.paper,
                ...theme.applyStyles('dark', {
                  backgroundColor: `color-mix(in srgb, ${theme.vars.palette.common.background} 56%, transparent)`,
                }),
                borderRadius:
                  theme.shape.borderRadius > 0
                    ? `calc(${theme.vars.shape.borderRadius} - 4px)`
                    : theme.vars.shape.borderRadius,
                boxShadow: `0px 2px 4px color-mix(in srgb, ${theme.vars.palette.common.onBackground} 4%, transparent)`,
                ...rootStyleOverrides?.[`.${tabsClasses.indicator}`],
              },
            }
          },
        },
      },
      MuiNavigationTabs: {
        ...widgetTheme.components?.MuiNavigationTabs,
      },
      MuiNavigationTab: {
        ...widgetTheme.components?.MuiNavigationTab,
      },
      MuiCheckbox: {
        styleOverrides: {
          root: {
            '&:hover': {
              backgroundColor: 'transparent',
            },
          },
        },
        ...widgetTheme.components?.MuiCheckbox,
      },
    },
  })

  return theme
}
