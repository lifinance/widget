import { tabsClasses } from '@mui/material'
import type { WidgetTheme } from '../types/widget.js'

export const watermelonLightTheme: WidgetTheme = {
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: '#f7557c',
        },
        secondary: {
          main: '#00A35A',
        },
        background: {
          default: '#ffeff3',
          paper: '#ffffff',
        },
        text: {
          primary: '#190006',
          secondary: '#766066',
        },
        grey: {
          200: '#F0E5E8',
          300: '#E5D7DA',
          700: '#7A666B',
          800: '#58373F',
        },
        playground: {
          main: '#f7557c',
        },
      },
    },
  },
  shape: {
    borderRadius: 16,
    borderRadiusSecondary: 16,
    borderRadiusTertiary: 24,
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
  },
  container: {
    boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.12)',
    borderRadius: '16px',
  },
  components: {
    MuiCard: {
      defaultProps: { variant: 'elevation' },
    },
    MuiNavigationTabs: {
      styleOverrides: {
        root: ({ theme }) => ({
          [`.${tabsClasses.indicator}`]: {
            backgroundColor: '#ffffff',
            filter: `drop-shadow(0 1px 4px rgba(${theme.vars.palette.common.onBackgroundChannel} / 0.08))`,
            borderRadius: '16px',
          },
        }),
      },
    },
    // MuiIconButton: {
    //   styleOverrides: {
    //     root: ({ theme }) => ({
    //       backgroundColor: alpha(theme.palette.common.white, 0.04),
    //       color: 'inherit',
    //       borderRadius: theme.vars.shape.borderRadiusSecondary,
    //       '&:hover': {
    //         backgroundColor: alpha(
    //           theme.palette.mode === 'light'
    //             ? theme.palette.common.black
    //             : theme.palette.common.white,
    //           0.08,
    //         ),
    //         color: 'inherit',
    //       },
    //     }),
    //   },
    // },
  },
} as WidgetTheme
