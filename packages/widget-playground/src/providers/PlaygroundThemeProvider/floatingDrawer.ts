import type { WidgetTheme } from '@lifi/widget'

const floatingDrawerStyleOverrides: WidgetTheme['components'] = {
  MuiDrawer: {
    styleOverrides: {
      paper: ({ theme }) => ({
        top: theme.spacing(1.5),
        right: theme.spacing(1.5),
        height: `calc(100% - ${theme.spacing(3)})`,
        borderRadius: theme.spacing(4),
        border: `1px solid ${theme.vars.palette.divider}`,
        boxShadow: `0 20px 40px color-mix(in srgb, ${theme.vars.palette.common.onBackground} 8%, transparent), 0 4px 12px color-mix(in srgb, ${theme.vars.palette.common.onBackground} 4%, transparent)`,
      }),
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
