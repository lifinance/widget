import { WidgetConfig } from '@lifi/widget';

export const defaultWidgetConfig: Partial<WidgetConfig> = {
  appearance: 'auto',
  theme: {
    palette: {
      primary: {
        main: '#3F49E1',
      },
      secondary: {
        main: '#F5B5FF',
      },
    },
  },
} as WidgetConfig;
