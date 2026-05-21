import type { WidgetTheme } from '@lifi/widget'
import {
  azureLightTheme,
  jumperTheme,
  watermelonLightTheme,
  windows95Theme,
} from '@lifi/widget'
import type { ThemeItem } from '../editTools/types.js'

const floatingDrawerComponents: WidgetTheme['components'] = {
  MuiDrawer: {
    styleOverrides: {
      paper: {
        top: 12,
        right: 12,
        height: 'calc(100% - 24px)',
        borderRadius: 32,
        border: '1px solid var(--lifi-palette-divider)',
        boxShadow:
          '0 20px 40px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.04)',
      },
    },
  },
}

const withFloatingDrawer = (theme: WidgetTheme): WidgetTheme => ({
  ...theme,
  components: {
    ...theme.components,
    ...floatingDrawerComponents,
  },
})

export const themeItems: ThemeItem[] = [
  {
    id: 'jumper',
    name: 'Jumper',
    theme: withFloatingDrawer(jumperTheme),
  },
  {
    id: 'azureLight',
    name: 'Azure Light',
    theme: withFloatingDrawer(azureLightTheme),
  },
  {
    id: 'watermelonLight',
    name: 'Watermelon Light',
    theme: withFloatingDrawer(watermelonLightTheme),
  },
  {
    id: 'windows95',
    name: 'Windows 95',
    theme: windows95Theme,
  },
]

export { floatingDrawerComponents }
