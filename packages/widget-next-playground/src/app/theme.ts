import { createTheme } from '@mui/material';
import { darken, lighten } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#3F49E1',
      light: lighten('#3F49E1', 0.5),
      dark: darken('#3F49E1', 0.2),
    },
    secondary: {
      main: '#F5B5FF',
      light: lighten('#F5B5FF', 0.5),
      dark: darken('#F5B5FF', 0.2),
    },
    success: {
      main: '#0AA65B',
    },
    warning: {
      main: '#FFCC00',
    },
    error: {
      main: '#E5452F',
    },
    info: {
      main: '#297EFF',
    },
  },
});
