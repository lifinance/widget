import { createTheme } from '@mui/material/styles';

// https://mui.com/customization/palette/
// declare module '@mui/material/styles' {
//   interface Palette {
//     appBar: Palette['primary'];
//   }
//   interface PaletteOptions {
//     appBar?: PaletteOptions['primary'];
//   }
// }

export const theme = createTheme({
  palette: {
    primary: {
      main: '#3F49E1',
      light: '#ACBEFF',
    },
    secondary: {
      main: '#F5B5FF',
    },
    background: {
      default: '#FBFCFC',
    },
    text: {
      primary: '#000',
      secondary: '#52575b',
    },
    grey: {
      100: '#F4F5F6',
      200: '#EFF1F2',
      300: '#E3E7E9',
      400: '#C6C9CD',
      500: '#AEB3B7',
      600: '#798086',
      700: '#57595C',
    },
  },
});
