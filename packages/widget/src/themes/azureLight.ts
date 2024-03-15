import type { WidgetTheme } from '../types/widget.js';

export const azureLightTheme: WidgetTheme = {
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
  playground: {
    background: '#f3f5f8',
  },
  components: {
    MuiCard: {
      defaultProps: { variant: 'filled' },
    },
  },
};
