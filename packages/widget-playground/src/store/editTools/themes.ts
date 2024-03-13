import { windows95Theme } from '@lifi/widget';
import type { ThemeItem } from './types';

export const themeItems: ThemeItem[] = [
  {
    id: 'windows95',
    name: 'Windows 95',
    theme: windows95Theme,
    options: {
      restrictAppearance: 'light',
    },
  },
];
