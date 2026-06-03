import {
  azureLightTheme,
  jumperTheme,
  watermelonLightTheme,
  windows95Theme,
} from '@lifi/widget'
import { withFloatingDrawer } from '../../providers/PlaygroundThemeProvider/floatingDrawer.js'
import type { ThemeItem } from '../editTools/types.js'

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
