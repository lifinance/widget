import type { CSSObject, Shape, SimplePaletteColorOptions } from '@mui/material'
import {
  alpha,
  buttonClasses,
  createTheme as createMuiTheme,
  css,
  darken,
  dialogActionsClasses,
  keyframes,
  lighten,
  tabsClasses,
  touchRippleClasses,
} from '@mui/material'
import type { WidgetTheme } from '../types/widget.js'
import { palette, paletteDark, paletteLight } from './palettes.js'
import type {} from './types.js'
import { getStyleOverrides } from './utils.js'

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

export const createTheme = (widgetTheme: WidgetTheme = {}) => {
  const configuredPaletteLight =
    widgetTheme.colorSchemes?.light?.palette ?? widgetTheme.palette
  const configuredPaletteDark =
    widgetTheme.colorSchemes?.dark?.palette ?? widgetTheme.palette

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
    cssVariables: { cssVarPrefix: 'lifi', colorSchemeSelector: 'class' },
    colorSchemes: {
      light: {
        palette: {
          ...palette,
          ...paletteLight,
          ...(widgetTheme.colorSchemes?.light?.palette ?? widgetTheme.palette),
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
          ...(widgetTheme.colorSchemes?.dark?.palette ?? widgetTheme.palette),
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
    header: widgetTheme.header,
    navigation: {
      edge: true,
      ...widgetTheme.navigation,
    },
    typography: {
      fontFamily: 'Inter var, Inter, sans-serif',
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
            '@supports (font-variation-settings: normal)': {
              fontFamily: 'Inter var, sans-serif',
              ...widgetTheme.typography,
            },
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
                    filter: `drop-shadow(0 1px 4px rgba(${theme.vars.palette.common.onBackgroundChannel} / 0.08))`,
                  },
                }),
              ...(typeof root === 'object' && root),
              ...(!!ownerState.onClick &&
                !!rootHover && {
                  '&:hover': {
                    ...rootHover,
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
              filter: `drop-shadow(0 1px 4px rgba(${theme.vars.palette.common.onBackgroundChannel} / 0.04))`,
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
              color: `rgba(${theme.vars.palette.common.onBackgroundChannel} / 0.56)`,
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
            backgroundColor: `rgba(${theme.vars.palette.primary.mainChannel} / 0.08)`,
            color: theme.vars.palette.primary.main,
            '&:hover': {
              backgroundColor: `rgba(${theme.vars.palette.primary.mainChannel} / 0.12)`,
            },
            ...theme.applyStyles('dark', {
              backgroundColor: `rgba(${theme.vars.palette.primary.mainChannel} / 0.42)`,
              color: theme.palette.getContrastText(
                alpha(theme.palette.primary.main, 0.08)
              ),
              '&:hover': {
                backgroundColor: `rgba(${theme.vars.palette.primary.mainChannel} / 0.56)`,
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
            [`.${dialogActionsClasses.root} &`]: {
              padding: '6px 12px',
            },
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
            backgroundColor: theme.vars.palette.background.default,
          }),
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
              backgroundColor: `rgba(${theme.vars.palette.common.onBackgroundChannel} / 0.04)`,
              ...theme.applyStyles('dark', {
                backgroundColor: `rgba(${theme.vars.palette.common.onBackgroundChannel} / 0.08)`,
              }),
              borderRadius: theme.vars.shape.borderRadius,
              ...rootStyleOverrides,
              [`.${tabsClasses.indicator}`]: {
                backgroundColor: theme.vars.palette.background.paper,
                ...theme.applyStyles('dark', {
                  backgroundColor: `rgba(${theme.vars.palette.common.backgroundChannel} / 0.56)`,
                }),
                borderRadius:
                  theme.shape.borderRadius > 0
                    ? `calc(${theme.vars.shape.borderRadius} - 4px)`
                    : theme.vars.shape.borderRadius,
                boxShadow: `0px 2px 4px rgba(${theme.vars.palette.common.onBackgroundChannel} / 0.04)`,
                ...rootStyleOverrides?.[`.${tabsClasses.indicator}`],
              },
            }
          },
        },
      },
    },
  })

  return theme
}
