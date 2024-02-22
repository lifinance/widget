import { loadingButtonClasses } from '@mui/lab';
import type {} from '@mui/lab/themeAugmentation';
import type { PaletteMode, SimplePaletteColorOptions } from '@mui/material';
import {
  alpha,
  createTheme as createMuiTheme,
  css,
  darken,
  dialogActionsClasses,
  getContrastRatio,
  keyframes,
  lighten,
  touchRippleClasses,
} from '@mui/material';
import type { ThemeConfig } from '../types/widget.js';

// @mui/icons-material ESM issue
// https://github.com/mui/material-ui/issues/30671

// https://mui.com/customization/palette/
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
    main: '#5C67FF',
    light: lighten('#5C67FF', 0.5),
    dark: darken('#5C67FF', 0.2),
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
  common: {
    black: '#000',
    white: '#fff',
  },
};

const paletteLight = {
  background: {
    default: '#F5F6FF',
  },
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
  borderRadiusSecondary: 12,
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
    getContrastRatio(palette.common.white, primaryMainColor) >= 3
      ? palette.common.white
      : palette.common.black;
  const contrastTextButtonColor =
    getContrastRatio(palette.common.white, alpha(primaryMainColor, 0.08)) >= 3
      ? palette.common.white
      : palette.common.black;
  const borderRadiusSecondary =
    theme.shape?.borderRadiusSecondary ?? shape.borderRadiusSecondary;
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
        xs: 360,
        sm: 416,
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
            borderRadius: borderRadiusSecondary,
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 600,
            [`&.Mui-disabled, &.Mui-disabled:hover`]: {
              color: alpha(
                mode === 'light' ? palette.common.black : palette.common.white,
                0.56,
              ),
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
            backgroundColor: alpha(
              mode === 'light' ? palette.common.black : palette.common.white,
              0.04,
            ),
            color: 'inherit',
            borderRadius: borderRadiusSecondary,
            '&:hover': {
              backgroundColor: alpha(
                mode === 'light' ? palette.common.black : palette.common.white,
                0.08,
              ),
              color: 'inherit',
            },
          },
        },
      },
      MuiAvatar: {
        styleOverrides: {
          root: {
            height: 40,
            width: 40,
          },
          img: {
            objectFit: 'contain',
          },
        },
        ...theme.components?.MuiAvatar,
      },
      MuiListItemText: {
        styleOverrides: {
          primary: ({ theme }) => ({
            fontWeight: 600,
            fontSize: '1.125rem',
            lineHeight: '1.2778',
            color: theme.palette.text.primary,
          }),
          secondary: ({ theme }) => ({
            fontWeight: 500,
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
