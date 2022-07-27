import { PaletteMode, SimplePaletteColorOptions } from '@mui/material';
import { dialogActionsClasses } from '@mui/material/DialogActions';
import {
  alpha,
  createTheme as createMuiTheme,
  darken,
  getContrastRatio,
  lighten,
} from '@mui/material/styles';
import { dark, light } from '@mui/material/styles/createPalette';
import { ThemeConfig } from '../types';

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
  interface Shape {
    borderRadius: number;
    borderRadiusSecondary: number;
  }
  interface Theme {
    shape: Shape;
  }
  interface ThemeOptions {
    shape?: Partial<Shape>;
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
    light: lighten('#F5B5FF', 0.5),
    dark: darken('#F5B5FF', 0.2),
  },
  success: {
    main: '#0AA65B',
  },
  warning: {
    main: '#FFE668',
  },
  error: {
    main: '#E5452F',
  },
  info: {
    main: '#297EFF',
  },
};

const shape = {
  borderRadius: 12,
  borderRadiusSecondary: 6,
};

export const createTheme = (mode: PaletteMode, theme: ThemeConfig = {}) =>
  createMuiTheme({
    typography: {
      fontFamily: 'Inter var, Inter, sans-serif',
      ...theme.typography,
    },
    palette: {
      mode,
      ...palette,
      primary: {
        main:
          (theme.palette?.primary as SimplePaletteColorOptions)?.main ??
          palette.primary.main,
        light: lighten(
          (theme.palette?.primary as SimplePaletteColorOptions)?.main ??
            palette.primary.main,
          0.5,
        ),
        dark: darken(
          (theme.palette?.primary as SimplePaletteColorOptions)?.main ??
            palette.primary.main,
          0.2,
        ),
      },
      secondary: {
        main:
          (theme.palette?.secondary as SimplePaletteColorOptions)?.main ??
          palette.secondary.main,
        light: lighten(
          (theme.palette?.secondary as SimplePaletteColorOptions)?.main ??
            palette.secondary.main,
          0.5,
        ),
        dark: darken(
          (theme.palette?.secondary as SimplePaletteColorOptions)?.main ??
            palette.secondary.main,
          0.2,
        ),
      },
      ...(mode === 'light'
        ? {
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
            background: {
              paper: '#212121',
            },
          }),
    },
    shape: {
      ...shape,
      ...theme.shape,
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
            ...theme.typography,
            '@supports (font-variation-settings: normal)': {
              fontFamily: 'Inter var, sans-serif',
              ...theme.typography,
            },
          },
        },
      },
      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
        styleOverrides: {
          ...(mode === 'dark'
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
            : {}),
          root: {
            borderRadius:
              theme.shape?.borderRadiusSecondary ?? shape.borderRadiusSecondary,
            textTransform: 'none',
            fontSize: '1rem',
            padding: '10px 16px',
            [`.${dialogActionsClasses.root} &`]: {
              padding: '6px 12px',
            },
            '&.Mui-disabled, &.Mui-disabled:hover': {
              color:
                mode === 'light'
                  ? 'rgb(0 0 0 / 70%)'
                  : 'rgb(255 255 255 / 70%)',
              cursor: 'not-allowed',
              pointerEvents: 'auto',
            },
          },
          contained: {
            '&:hover': {
              color:
                getContrastRatio(palette.primary.main, dark.text.primary) >= 3
                  ? dark.text.primary
                  : light.text.primary,
            },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            color: 'inherit',
            '&:hover': {
              color: 'inherit',
            },
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
