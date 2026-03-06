import { alpha, createTheme, darken, lighten } from '@mui/material'

const primaryMain = '#5C67FF'
const secondaryMain = '#F7C2FF'

export const theme = createTheme({
  cssVariables: true,
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: primaryMain,
          light: lighten(primaryMain, 0.84),
          dark: darken(primaryMain, 0.2),
        },
        secondary: {
          main: secondaryMain,
          light: lighten(secondaryMain, 0.84),
          dark: darken(secondaryMain, 0.2),
        },
        background: {
          paper: '#ffffff',
          default: '#ffffff',
        },
        text: {
          primary: '#000000',
          secondary: '#747474',
        },
        success: { main: '#0AA65B' },
        warning: { main: '#FFCC00' },
        error: { main: '#E5452F' },
        info: { main: '#297EFF' },
        grey: {
          200: '#eeeeee',
          300: '#e0e0e0',
          700: '#616161',
          800: '#424242',
        },
      },
    },
    dark: {
      palette: {
        primary: {
          main: primaryMain,
          light: lighten(primaryMain, 0.84),
          dark: darken(primaryMain, 0.2),
        },
        secondary: {
          main: secondaryMain,
          light: lighten(secondaryMain, 0.84),
          dark: darken(secondaryMain, 0.2),
        },
        background: {
          paper: '#212121',
          default: '#121212',
        },
        text: {
          primary: '#ffffff',
          secondary: '#bbbbbb',
        },
        success: { main: '#0AA65B' },
        warning: { main: '#FFCC00' },
        error: { main: '#E5452F' },
        info: { main: '#297EFF' },
        grey: {
          200: '#eeeeee',
          300: '#e0e0e0',
          700: '#616161',
          800: '#424242',
        },
      },
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
  },
  components: {
    MuiCard: {
      defaultProps: {
        variant: 'outlined',
      },
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: theme.vars.shape.borderRadius,
          backgroundImage: 'none',
          transition: theme.transitions.create(['background-color', 'filter'], {
            duration: theme.transitions.duration.enteringScreen,
            easing: theme.transitions.easing.easeOut,
          }),
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: `color-mix(in srgb, ${theme.vars.palette.background.paper} 98%, black)`,
            ...theme.applyStyles('dark', {
              backgroundColor: `color-mix(in srgb, ${theme.vars.palette.background.paper} 98%, white)`,
            }),
          },
        }),
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: theme.vars.shape.borderRadius,
          textTransform: 'none' as const,
          fontWeight: 600,
        }),
        text: ({ theme }) => ({
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
          objectFit: 'contain' as const,
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
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundImage: 'none',
        },
      },
    },
  },
})
