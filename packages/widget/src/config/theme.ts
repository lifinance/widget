import { PaletteMode } from '@mui/material';
import {
  alpha,
  createTheme as createMuiTheme,
  darken,
  lighten,
} from '@mui/material/styles';

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

const palette = {
  primary: {
    main: '#3F49E1',
    light: lighten('#3F49E1', 0.5),
    dark: darken('#3F49E1', 0.2),
  },
  secondary: {
    main: '#F5B5FF',
    light: lighten('#F5B5FF', 0.2),
    dark: darken('#F5B5FF', 0.2),
  },
  success: {
    main: '#0AA65B',
  },
};

export const createTheme = (mode: PaletteMode) =>
  createMuiTheme({
    typography: {
      fontFamily: 'Inter var, Inter, sans-serif',
    },
    palette: {
      mode,
      ...(mode === 'light'
        ? {
            ...palette,
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
          }
        : {
            ...palette,
            background: {
              paper: '#212121',
            },
          }),
    },
    shape: {
      borderRadius: 6,
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 392,
        md: 900,
        lg: 1200,
        xl: 1536,
      },
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
      MuiButton: {
        styleOverrides:
          mode === 'dark'
            ? {
                outlined: {
                  color: palette.primary.light,
                  borderColor: palette.primary.light,
                  '&:hover': {
                    backgroundColor: alpha(palette.primary.light, 0.08),
                    borderColor: palette.primary.light,
                  },
                },
                text: {
                  color: palette.primary.light,
                  '&:hover': {
                    backgroundColor: alpha(palette.primary.light, 0.08),
                    borderColor: palette.primary.light,
                  },
                },
              }
            : undefined,
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            color: 'inherit',
          },
        },
      },
      MuiAvatar: {
        styleOverrides: {
          root: {
            height: 32,
            width: 32,
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
  });
