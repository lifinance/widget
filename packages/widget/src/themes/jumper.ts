import type { WidgetTheme } from '../types/widget.js'

export const jumperTheme: WidgetTheme = {
  typography: {},
  header: {
    overflow: 'visible',
  },
  container: {
    boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.12)',
    borderRadius: '24px',
  },
  shape: {
    borderRadius: 12,
    borderRadiusSecondary: 24,
  },
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: '#30007A',
        },
        secondary: {
          main: '#8700B8',
        },
        background: {
          default: '#F9F5FF',
          paper: '#FFFFFF',
        },
        text: {
          primary: '#000000',
          secondary: '#818084',
        },
        grey: {
          200: '#ECEBF0',
          300: '#E5E1EB',
          700: '#70767A',
          800: '#4B4F52',
        },
        playground: {
          main: '#F3EBFF',
        },
      },
    },
    dark: {
      palette: {
        primary: {
          main: '#653BA3',
        },
        secondary: {
          main: '#D35CFF',
        },
        background: {
          default: '#24203D',
          paper: '#302B52',
        },
        text: {
          primary: '#ffffff',
          secondary: '#9490a5',
        },
        grey: {
          200: '#ECEBF0',
          300: '#DDDCE0',
          700: '#70767A',
          800: '#3c375c',
        },
        playground: {
          main: '#120F29',
        },
      },
    },
  },
  components: {
    MuiCard: {
      defaultProps: { variant: 'elevation' },
    },
  },
}
