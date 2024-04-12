import { loadingButtonClasses } from '@mui/lab';
import type {} from '@mui/lab/themeAugmentation';
import type {
  CSSObject,
  PaletteMode,
  Shape,
  SimplePaletteColorOptions,
} from '@mui/material';
import {
  alpha,
  createTheme as createMuiTheme,
  css,
  darken,
  dialogActionsClasses,
  getContrastRatio,
  keyframes,
  lighten,
  tabsClasses,
  touchRippleClasses,
} from '@mui/material';
import type { WidgetTheme } from '../types/widget.js';
import { palette, paletteDark, paletteLight } from './palettes.js';
import type {} from './types.js';
import { getStyleOverrides } from './utils.js';

const shape: Shape = {
  borderRadius: 12,
  borderRadiusSecondary: 12,
  borderRadiusTertiary: 24,
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

export const createTheme = (
  mode: PaletteMode,
  widgetTheme: WidgetTheme = {},
) => {
  const primaryMainColor =
    (widgetTheme.palette?.primary as SimplePaletteColorOptions)?.main ??
    palette.primary.main;
  const primaryLightColor = lighten(primaryMainColor, 0.84);
  const primaryDarkColor = darken(primaryMainColor, 0.2);
  const secondaryMainColor =
    (widgetTheme.palette?.secondary as SimplePaletteColorOptions)?.main ??
    palette.secondary.main;
  const contrastButtonColor =
    getContrastRatio(palette.common.white, primaryMainColor) >= 3
      ? palette.common.white
      : palette.common.black;
  const contrastTextButtonColor =
    getContrastRatio(palette.common.white, alpha(primaryMainColor, 0.08)) >= 3
      ? palette.common.white
      : palette.common.black;
  const borderRadiusSecondary =
    widgetTheme.shape?.borderRadiusSecondary ?? shape.borderRadiusSecondary;

  return createMuiTheme({
    container: widgetTheme.container,
    navigation: {
      edge: true,
      ...widgetTheme.navigation,
    },
    typography: {
      fontFamily: 'Inter var, Inter, sans-serif',
      ...widgetTheme.typography,
    },
    palette: {
      mode,
      ...palette,
      ...(mode === 'light' ? paletteLight : paletteDark),
      ...widgetTheme.palette,
      primary: {
        main: primaryMainColor,
        light: primaryLightColor,
        dark: primaryDarkColor,
      },
      secondary: {
        main: secondaryMainColor,
        light: lighten(secondaryMainColor, 0.84),
        dark: darken(secondaryMainColor, 0.2),
      },
    },
    shape: {
      ...shape,
      ...widgetTheme.shape,
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
            ...widgetTheme.typography,
            '@supports (font-variation-settings: normal)': {
              fontFamily: 'Inter var, sans-serif',
              ...widgetTheme.typography,
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: ({ ownerState, theme }) => ({
            minHeight: 40,
            padding: 0,
            ...getStyleOverrides('MuiAppBar', 'root', widgetTheme, ownerState),
          }),
        },
      },
      MuiCard: {
        defaultProps: {
          variant: 'outlined',
          ...widgetTheme.components?.MuiCard?.defaultProps,
        },
        styleOverrides: {
          root: ({ ownerState, theme }) => {
            const root = widgetTheme.components?.MuiCard?.styleOverrides
              ?.root as CSSObject;
            const rootHover = root?.['&:hover'];
            return {
              backgroundColor: theme.palette.background.paper,
              borderRadius: theme.shape.borderRadius,
              overflow: 'hidden',
              position: 'relative',
              boxSizing: 'border-box',
              transition: theme.transitions.create(
                ['background-color', 'filter'],
                {
                  duration: theme.transitions.duration.enteringScreen,
                  easing: theme.transitions.easing.easeOut,
                },
              ),
              ...(!!ownerState.onClick && {
                '&:hover': {
                  cursor: 'pointer',
                },
              }),
              ...(!!ownerState.onClick &&
                (ownerState.variant === 'outlined' ||
                  ownerState.variant === 'filled') && {
                  '&:hover': {
                    cursor: 'pointer',
                    backgroundColor:
                      theme.palette.mode === 'light'
                        ? darken(theme.palette.background.paper, 0.02)
                        : lighten(theme.palette.background.paper, 0.02),
                  },
                }),
              ...(!!ownerState.onClick &&
                ownerState.variant === 'elevation' && {
                  '&:hover': {
                    cursor: 'pointer',
                    filter: `drop-shadow(0 1px 4px ${alpha(theme.palette.common.black, 0.08)})`,
                  },
                }),
              ...(typeof root === 'object' && root),
              ...(!!ownerState.onClick &&
                !!rootHover && {
                  '&:hover': {
                    ...rootHover,
                  },
                }),
              ...(!ownerState.onClick && {
                '&:hover': {},
              }),
            };
          },
        },
        variants: widgetTheme.components?.MuiCard?.variants ?? [
          {
            props: { variant: 'outlined' },
            style: ({ theme }) => ({
              borderWidth: 1,
              borderStyle: 'solid',
              borderColor:
                theme.palette.mode === 'light'
                  ? theme.palette.grey[300]
                  : theme.palette.grey[800],
            }),
          },
          {
            props: { variant: 'elevation' },
            style: ({ theme }) => ({
              border: 'none',
              boxShadow: 'none',
              filter: `drop-shadow(0 1px 4px ${alpha(theme.palette.common.black, 0.04)})`,
            }),
          },
          {
            props: { variant: 'filled' },
            style: {
              border: 'none',
            },
          },
        ],
      },
      MuiInputCard: {
        ...widgetTheme.components?.MuiInputCard,
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
          ...widgetTheme.components?.MuiButton?.defaultProps,
        },
        styleOverrides: {
          root: ({ theme, ownerState }) => ({
            borderRadius: borderRadiusSecondary,
            textTransform: 'none',
            fontSize: 16,
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
            ...getStyleOverrides('MuiButton', 'root', widgetTheme, ownerState),
          }),
          text: ({ theme, ownerState }) => ({
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
            ...getStyleOverrides('MuiButton', 'text', widgetTheme, ownerState),
          }),
          contained: ({ theme, ownerState }) => ({
            '&:hover': {
              color: contrastButtonColor,
            },
            ...getStyleOverrides(
              'MuiButton',
              'contained',
              widgetTheme,
              ownerState,
            ),
          }),
          sizeMedium: ({ theme, ownerState }) => ({
            padding: '10px 14px',
            [`.${dialogActionsClasses.root} &`]: {
              padding: '6px 12px',
            },
            ...getStyleOverrides(
              'MuiButton',
              'sizeMedium',
              widgetTheme,
              ownerState,
            ),
          }),
        },
      },
      MuiIconButton: {
        ...widgetTheme.components?.MuiIconButton,
        styleOverrides: {
          ...widgetTheme.components?.MuiIconButton?.styleOverrides,
          root: ({ theme, ownerState }) => ({
            color: 'inherit',
            '&:hover': {
              color: 'inherit',
            },
            ...getStyleOverrides(
              'MuiIconButton',
              'root',
              widgetTheme,
              ownerState,
            ),
          }),
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
        ...widgetTheme.components?.MuiAvatar,
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
      MuiMenu: {
        styleOverrides: {
          paper: ({ theme }) => ({
            backgroundColor: theme.palette.background.default,
          }),
        },
      },
      MuiTabs: {
        ...widgetTheme.components?.MuiTabs,
        styleOverrides: {
          ...widgetTheme.components?.MuiTabs?.styleOverrides,
          root: ({ theme, ownerState }) => {
            const rootStyleOverrides = getStyleOverrides(
              'MuiTabs',
              'root',
              widgetTheme,
              ownerState,
            );
            return {
              backgroundColor:
                theme.palette.mode === 'light'
                  ? alpha(theme.palette.common.black, 0.04)
                  : alpha(theme.palette.common.white, 0.08),
              borderRadius: theme.shape.borderRadius,
              ...rootStyleOverrides,
              [`.${tabsClasses.indicator}`]: {
                backgroundColor:
                  theme.palette.mode === 'light'
                    ? theme.palette.background.paper
                    : alpha(theme.palette.common.black, 0.56),
                borderRadius:
                  theme.shape.borderRadius > 0
                    ? theme.shape.borderRadius - 4
                    : theme.shape.borderRadius,
                boxShadow: `0px 2px 4px ${alpha(theme.palette.common.black, 0.04)}`,
                ...rootStyleOverrides?.[`.${tabsClasses.indicator}`],
              },
            };
          },
        },
      },
    },
  });
};
