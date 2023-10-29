import { loadingButtonClasses } from '@mui/lab/LoadingButton';
import type { PaletteMode, SimplePaletteColorOptions } from '@mui/material';
import { touchRippleClasses } from '@mui/material/ButtonBase';
import { dialogActionsClasses } from '@mui/material/DialogActions';
import { common } from '@mui/material/colors';
import {
  alpha,
  createTheme as createMuiTheme,
  css,
  darken,
  getContrastRatio,
  keyframes,
  lighten,
} from '@mui/material/styles';
import type { ThemeConfig } from '../types';

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
    main: '#FFCC00',
  },
  error: {
    main: '#E5452F',
  },
  info: {
    main: '#297EFF',
  },
};

const paletteLight = {
  text: {
    primary: '#000000',
    secondary: '#747474',
  },
};

const paletteDark = {
  background: {
    paper: '#212121',
  },
};

const shape = {
  borderRadius: 12,
  borderRadiusSecondary: 8,
};

const enterKeyframe = keyframes`
  0% {
    transform: scale(0);
    opacity: 0.05;
  }
  100% {
    transform: scale(1);
    opacity: 0.1;
  }
`;

export const createTheme = (mode: PaletteMode, theme: ThemeConfig = {}) => {
  const primaryMainColor =
    (theme.palette?.primary as SimplePaletteColorOptions)?.main ??
    palette.primary.main;
  const primaryLightColor = lighten(
    (theme.palette?.primary as SimplePaletteColorOptions)?.main ??
      palette.primary.main,
    0.5,
  );
  const primaryDarkColor = darken(
    (theme.palette?.primary as SimplePaletteColorOptions)?.main ??
      palette.primary.main,
    0.2,
  );
  const contrastButtonColor =
    getContrastRatio(common.white, primaryMainColor) >= 3
      ? common.white
      : common.black;
  const contrastTextButtonColor =
    getContrastRatio(common.white, alpha(primaryMainColor, 0.08)) >= 3
      ? common.white
      : common.black;
  return createMuiTheme({
    typography: {
      fontFamily: 'Inter var, Inter, sans-serif',
      ...theme.typography,
    },
    palette: {
      mode,
      ...palette,
      ...(mode === 'light' ? paletteLight : paletteDark),
      ...theme.palette,
      primary: {
        main: primaryMainColor,
        light: primaryLightColor,
        dark: primaryDarkColor,
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
      MuiButtonBase: {
        styleOverrides: {
          // This `css()` function invokes keyframes. `styled-components` only supports keyframes
          // in string templates. Do not convert these styles in JS object as it will break.
          root: css`
            &
              .${touchRippleClasses.ripple}.${touchRippleClasses.rippleVisible} {
              opacity: 0.1;
              animation-name: ${enterKeyframe};
            }
          `,
        },
      },
      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
        styleOverrides: {
          root: {
            borderRadius:
              theme.shape?.borderRadiusSecondary ?? shape.borderRadiusSecondary,
            textTransform: 'none',
            fontSize: '1rem',
            [`&.Mui-disabled, &.Mui-disabled:hover`]: {
              color:
                mode === 'light'
                  ? alpha(common.black, 0.56)
                  : alpha(common.white, 0.56),
              cursor: 'not-allowed',
              pointerEvents: 'auto',
            },
            [`&.${loadingButtonClasses.loading}.Mui-disabled`]: {
              backgroundColor: primaryMainColor,
              color: contrastButtonColor,
              cursor: 'auto',
              pointerEvents: 'auto',
            },
            [`.${loadingButtonClasses.loadingIndicator}`]: {
              color: contrastButtonColor,
            },
            [`&.${loadingButtonClasses.root}.${loadingButtonClasses.loading}`]:
              {
                color: 'transparent',
              },
          },
          text: {
            backgroundColor:
              mode === 'light'
                ? alpha(primaryMainColor, 0.08)
                : alpha(primaryMainColor, 0.42),
            '&:hover': {
              backgroundColor:
                mode === 'light'
                  ? alpha(primaryMainColor, 0.12)
                  : alpha(primaryMainColor, 0.56),
            },
            color:
              mode === 'light' ? primaryMainColor : contrastTextButtonColor,
          },
          contained: {
            '&:hover': {
              color: contrastButtonColor,
            },
          },
          sizeMedium: {
            padding: '10px 14px',
            [`.${dialogActionsClasses.root} &`]: {
              padding: '6px 12px',
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
        ...theme.components?.MuiAvatar,
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
      MuiTooltip: {
        styleOverrides: {
          tooltip: ({ theme }) => ({
            backgroundColor: 'rgb(0 0 0 / 64%)',
            backdropFilter: 'blur(3px)',
            fontSize: '0.75rem',
            padding: theme.spacing(1, 1.5),
          }),
          arrow: {
            color: 'rgb(0 0 0 / 64%)',
          },
        },
      },
    },
  });
};
