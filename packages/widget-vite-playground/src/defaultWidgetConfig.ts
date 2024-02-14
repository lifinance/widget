import type { WidgetConfig } from '@lifi/widget';

// TODO: question do we want to move some of the sections of code we use
//  for testing in the other playgrounds config into here?
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
    typography: {
      fontFamily: 'Inter, sans-serif',
    },
  },
} as WidgetConfig;
