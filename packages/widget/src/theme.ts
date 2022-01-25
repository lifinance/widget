import { createTheme } from '@mui/material/styles';

// https://mui.com/customization/palette/
declare module '@mui/material/styles' {
  interface Palette {
    appBar: Palette['primary'];
    appBarText: Palette['text'];
  }
  interface PaletteOptions {
    appBar?: PaletteOptions['primary'];
    appBarText?: PaletteOptions['text'];
  }
}

export const theme = createTheme({
  palette: {
    primary: {
      main: '#3F49E1',
      light: '#ACBEFF',
    },
    secondary: {
      main: '#F5B5FF',
    },
    appBar: {
      main: '#000',
    },
    appBarText: {
      primary: '#fff',
      secondary: '#A1A1A1',
    },
    background: {
      default: '#FBFCFC',
    },
    text: {
      primary: '#000',
      secondary: '#52575b',
    },
  },
});
