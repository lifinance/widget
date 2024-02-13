import { createTheme } from '@mui/material';

const initValues = {
  palette: {
    primary: {
      main: '#3F49E1',
    },
    secondary: {
      main: '#F5B5FF',
    },
  },
  typography: {
    fontFamily: ['Inter', 'sans-serif'].join(','),
  },
  shape: {
    borderRadius: 12,
    borderRadiusSecondary: 12,
  },
};

export const theme = createTheme(initValues);
