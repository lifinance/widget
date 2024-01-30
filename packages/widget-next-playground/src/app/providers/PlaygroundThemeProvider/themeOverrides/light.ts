import { Theme } from '@mui/material';
export const lightPalette = {
  mode: 'light',
  text: {
    primary: '#000000',
    secondary: '#747474',
    disabled: 'rgba(0, 0, 0, 0.38)',
  },
};

export const lightComponents = {
  MuiCssBaseline: {
    styleOverrides: (theme: Theme) => ({
      body: {
        backgroundColor: theme.palette.grey[100],
      },
    }),
  },
};
