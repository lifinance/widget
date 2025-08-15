import { checkboxClasses, tabsClasses } from '@mui/material'
import type { WidgetTheme } from '../types/widget.js'

export const windows95Theme: WidgetTheme = {
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: '#0000ff',
        },
        secondary: {
          main: '#f7c303',
        },
        text: {
          primary: '#30313d',
          secondary: '#6d6e78',
        },
        background: {
          default: '#c0c9d2',
          paper: '#dfdfdf',
        },
        grey: {
          300: '#bbbbbb',
        },
        playground: {
          main: '#008080',
        },
      },
    },
  },
  shape: {
    borderRadius: 0,
    borderRadiusSecondary: 0,
    borderRadiusTertiary: 0,
  },
  container: {
    border: '1px solid #0a0a0a',
  },
  navigation: {
    edge: false,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow:
            'inset -1px -1px #0a0a0a, inset 1px 1px #ffffff, inset -2px -2px #808080, inset 2px 2px #dfdfdf',
          '&:hover': {
            boxShadow:
              'inset -1px -1px #0a0a0a, inset 1px 1px #ffffff, inset -2px -2px #808080, inset 2px 2px #dfdfdf',
          },
        },
      },
    },
    MuiCard: {
      defaultProps: {
        variant: 'outlined',
      },
      styleOverrides: {
        root: {
          boxShadow:
            'inset -1px -1px #0a0a0a, inset 1px 1px #ffffff, inset -2px -2px #808080, inset 2px 2px #dfdfdf',
          borderWidth: 0,
          '&:hover': {
            cursor: 'pointer',
            backgroundColor: '#cccccc',
          },
        },
      },
      variants: [
        {
          props: { variant: 'outlined' },
          style: {
            borderWidth: 0,
          },
        },
      ],
    },
    MuiInputCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          boxShadow:
            'inset -1px -1px #ffffff, inset 1px 1px #0a0a0a, inset -2px -2px #dfdfdf, inset 2px 2px #808080',
        },
      },
    },
    MuiNavigationTabs: {
      styleOverrides: {
        root: {
          [`.${tabsClasses.indicator}`]: {
            backgroundColor: '#dfdfdf',
            boxShadow:
              'inset -1px -1px #0a0a0a, inset 1px 1px #ffffff, inset -2px -2px #808080, inset 2px 2px #dfdfdf',
          },
        },
      },
    },
    MuiIconButton: {
      defaultProps: {
        // disableRipple: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 0,
          boxShadow:
            'inset -1px -1px #0a0a0a, inset 1px 1px #ffffff, inset -2px -2px #808080, inset 2px 2px #dfdfdf',
          backgroundColor: '#dfdfdf',
          '&:hover': {
            color: 'inherit',
            backgroundColor: '#cccccc',
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: '#0a0a0a',
          [`&.${checkboxClasses.checked}`]: {
            color: '#0a0a0a',
          },
          [`&.${checkboxClasses.indeterminate}`]: {
            color: '#0a0a0a',
          },
        },
      },
    },
  },
}
