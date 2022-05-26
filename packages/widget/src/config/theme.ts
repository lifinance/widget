import { PaletteMode } from '@mui/material';
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

declare module '@mui/material/styles' {
  interface TypographyVariants {
    '@supports (font-variation-settings: normal)': React.CSSProperties;
  }
  interface TypographyVariantsOptions {
    '@supports (font-variation-settings: normal)'?: React.CSSProperties;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    '@supports (font-variation-settings: normal)': true;
  }
}

export const createColorSchemeTheme = (mode: PaletteMode) =>
  createTheme({
    typography: {
      fontFamily: 'Inter var, Inter, sans-serif',
    },
    palette: {
      mode,
      ...(mode === 'light'
        ? {
            primary: {
              main: '#3F49E1',
              light: '#ACBEFF',
            },
            secondary: {
              main: '#F5B5FF',
            },
            text: {
              primary: '#000',
              secondary: '#52575b',
            },
            success: {
              main: '#0AA65B',
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
          }
        : {
            primary: {
              main: '#3F49E1',
              light: '#ACBEFF',
            },
            secondary: {
              main: '#F5B5FF',
            },
            background: {
              paper: '#212121',
            },
            success: {
              main: '#0AA65B',
            },
          }),
    },
    shape: {
      borderRadius: 6,
    },
    components: {
      MuiScopedCssBaseline: {
        styleOverrides: {
          root: {
            fontFamily: 'Inter, sans-serif',
            '@supports (font-variation-settings: normal)': {
              fontFamily: 'Inter var, sans-serif',
            },
          },
        },
      },
      MuiAvatar: {
        styleOverrides: {
          root: {
            backgroundColor: '#fff',
            height: 32,
            width: 32,
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            color: 'inherit',
          },
        },
      },
      MuiListItemAvatar: {
        styleOverrides: {
          root: {
            minWidth: 48,
          },
        },
      },
      MuiListItemText: {
        styleOverrides: {
          primary: ({ theme }) => ({
            fontWeight: '500',
            fontSize: '1.125rem',
            lineHeight: '1.2778',
            color: theme.palette.text.primary,
          }),
          secondary: ({ theme }) => ({
            fontWeight: '400',
            fontSize: '0.75rem',
            color: theme.palette.text.secondary,
          }),
        },
      },
    },
    // components: {
    //   MuiPopover: {
    //     styleOverrides: {
    //       paper: {
    //         border: '1px black solid',
    //         borderLeft: 'none',
    //         borderRadius: 0,
    //         boxShadow: '5px 5px 0px 0px #000000 !important',
    //       },
    //     },
    //   },
    // },
  });
