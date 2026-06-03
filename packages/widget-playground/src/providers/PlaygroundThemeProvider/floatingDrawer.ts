import type { WidgetTheme } from '@lifi/widget'

const floatingDrawerStyleOverrides: WidgetTheme['components'] = {
  MuiDrawer: {
    styleOverrides: {
      paper: ({ theme, ownerState }) =>
        ownerState.anchor === 'right'
          ? {
              top: theme.spacing(1.5),
              right: theme.spacing(1.5),
              height: `calc(100% - ${theme.spacing(3)})`,
              borderRadius: theme.spacing(4),
              border: `1px solid ${theme.vars.palette.divider}`,
              filter: 'drop-shadow(0px 8px 32px rgba(0, 0, 0, 0.08))',
            }
          : {},
    },
  },
}

export const withFloatingDrawer = (theme: WidgetTheme): WidgetTheme => ({
  ...theme,
  components: {
    ...theme.components,
    ...floatingDrawerStyleOverrides,
  },
})
