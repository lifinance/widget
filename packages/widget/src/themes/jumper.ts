import type { WidgetTheme } from '../types/widget.js';

export const jumperTheme: WidgetTheme = {
  palette: {},
  // shape: {
  //   borderRadius: 0,
  //   borderRadiusSecondary: 0,
  //   borderRadiusTertiary: 0,
  // },
  container: {},
  playground: {},
  components: {
    MuiIconButton: {
      styleOverrides: {
        // root: ({ theme }) => ({
        //   backgroundColor: alpha(
        //     theme.palette.mode === 'light'
        //       ? theme.palette.common.black
        //       : theme.palette.common.white,
        //     0.04,
        //   ),
        //   color: 'inherit',
        //   borderRadius: theme.shape.borderRadiusSecondary,
        //   '&:hover': {
        //     backgroundColor: alpha(
        //       theme.palette.mode === 'light'
        //         ? theme.palette.common.black
        //         : theme.palette.common.white,
        //       0.08,
        //     ),
        //     color: 'inherit',
        //   },
        // }),
      },
    },
  },
};
