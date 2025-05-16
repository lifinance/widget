import { tabsClasses } from '@mui/material'
import type { WidgetTheme } from '../types/widget.js'

export const azureLightTheme: WidgetTheme = {
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: '#006Eff',
        },
        secondary: {
          main: '#FFC800',
        },
        background: {
          default: '#ffffff',
          paper: '#f8f8fa',
        },
        text: {
          primary: '#00070F',
          secondary: '#6A7481',
        },
        grey: {
          200: '#EEEFF2',
          300: '#D5DAE1',
          700: '#555B62',
          800: '#373F48',
        },
        playground: {
          main: '#f3f5f8',
        },
      },
    },
  },
  shape: {
    borderRadius: 12,
    borderRadiusSecondary: 12,
    borderRadiusTertiary: 24,
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
  },
  container: {
    boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.08)',
    borderRadius: '16px',
  },
  components: {
    MuiCard: {
      defaultProps: { variant: 'filled' },
    },
    // Used only for 'split' subvariant and can be safely removed if not used
    MuiTabs: {
      styleOverrides: {
        root: {
          backgroundColor: '#f8f8fa',
          [`.${tabsClasses.indicator}`]: {
            backgroundColor: '#ffffff',
          },
        },
      },
    },
  },
}
