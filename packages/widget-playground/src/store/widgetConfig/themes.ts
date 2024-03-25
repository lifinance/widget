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
    theme: {
      light: azureLightTheme,
    },
  },
  {
    id: 'watermelon',
    name: 'Watermelon',
    theme: {
      light: watermelonLightTheme,
      dark: {
        ...watermelonLightTheme,
        playground: {
          background: '#A80027',
        },
      },
    },
  },
  {
    id: 'windows95',
    name: 'Windows 95',
    theme: {
      light: windows95Theme,
    },
  },
];
