import {
  azureLightTheme,
  jumperTheme,
  watermelonLightTheme,
  windows95Theme,
} from '@lifi/widget'
import type { ThemeItem } from '../editTools/types'

export const themeItems: ThemeItem[] = [
  {
    id: 'jumper',
    name: 'Jumper',
    theme: jumperTheme,
  },
  {
    id: 'azureLight',
    name: 'Azure Light',
    theme: azureLightTheme,
  },
  {
    id: 'watermelonLight',
    name: 'Watermelon Light',
    theme: watermelonLightTheme,
  },
  {
    id: 'windows95',
    name: 'Windows 95',
    theme: windows95Theme,
  },
]
