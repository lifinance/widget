import type { WidgetTheme } from '@lifi/widget'
import { createTheme as createMuiTheme, type Theme } from '@mui/material'

export const createTheme = (playgroundColor?: string) =>
  createMuiTheme({
    cssVariables: { cssVarPrefix: 'lifi-pg', colorSchemeSelector: 'class' },
    colorSchemes: {
      light: {
        palette: {
          primary: {
            main: '#5C67FF',
          },
          secondary: {
            main: '#F5B000',
          },
          common: {
            background: '#f5f5f5',
          },
          text: {
            primary: '#000000',
            secondary: '#747474',
            disabled: 'rgba(0, 0, 0, 0.38)',
          },
          playground: {
            main: playgroundColor || '#F5F5F5',
          },
        },
      },
      dark: {
        palette: {
          primary: {
            main: '#5C67FF',
          },
          secondary: {
            main: '#F5B000',
          },
          background: {
            paper: '#212121',
            default: '#121212',
          },
          text: {
            primary: '#fff',
            secondary: 'rgba(255, 255, 255, 0.7)',
            disabled: 'rgba(255, 255, 255, 0.5)',
          },
          divider: 'rgba(255, 255, 255, 0.12)',
          action: {
            active: '#fff',
            hover: 'rgba(255, 255, 255, 0.08)',
            hoverOpacity: 0.08,
            selected: 'rgba(255, 255, 255, 0.16)',
            selectedOpacity: 0.16,
            disabled: 'rgba(255, 255, 255, 0.3)',
            disabledBackground: 'rgba(255, 255, 255, 0.12)',
            disabledOpacity: 0.38,
            focus: 'rgba(255, 255, 255, 0.12)',
            focusOpacity: 0.12,
            activatedOpacity: 0.24,
          },
          playground: {
            main: playgroundColor || '#000000',
          },
        },
      },
    },
    typography: {
      fontFamily: ['Inter', 'sans-serif'].join(','),
    },
    shape: {
      borderRadius: 12,
      borderRadiusSecondary: 12,
      borderRadiusTertiary: 24,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: (theme: WidgetTheme & Theme) => ({
          body: {
            display: 'flex',
            overscrollBehavior: 'none',
            '@supports (height: 100dvh)': {
              minHeight: '100dvh',
            },
            '@supports not (height: 100dvh)': {
              minHeight: '100vh',
            },
            background:
              theme.vars.palette?.playground?.main ||
              theme.vars.palette?.common?.background,
          },
        }),
      },
      MuiCard: {
        defaultProps: {
          variant: 'outlined',
        },
        styleOverrides: {
          root: ({ ownerState, theme }) => {
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
              ...(!ownerState.onClick && {
                '&:hover': {},
              }),
            }
          },
        },
        variants: [
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
    },
  })
