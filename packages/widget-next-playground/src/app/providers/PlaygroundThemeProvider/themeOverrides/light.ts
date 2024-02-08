import type { Theme } from '@mui/material';
export const lightPalette = {
  mode: 'light',
  text: {
    primary: '#000000',
    secondary: '#747474',
    disabled: 'rgba(0, 0, 0, 0.38)',
  },
};

// TODO: look at moving the Baseline to the central theme?
export const lightComponents = {
  MuiCssBaseline: {
    styleOverrides: (theme: Theme) => ({
      body: {
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: theme.palette.grey[100],
      },
    }),
  },
};
