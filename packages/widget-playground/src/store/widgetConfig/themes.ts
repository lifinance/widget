import {
  azureLightTheme,
  watermelonLightTheme,
  windows95Theme,
} from '@lifi/widget';
import type { ThemeItem } from '../editTools/types';

export const themeItems: ThemeItem[] = [
  {
    id: 'azureLight',
    name: 'Azure Light',
    theme: azureLightTheme,
    options: {
      restrictAppearance: 'light',
    },
  },
  {
    id: 'watermelonLight',
    name: 'Watermelon Light',
    theme: watermelonLightTheme,
    options: {
      restrictAppearance: 'light',
    },
  },
  {
    id: 'windows95',
    name: 'Windows 95',
    theme: windows95Theme,
    options: {
      restrictAppearance: 'light',
    },
  },
];
