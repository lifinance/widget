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
  containerStyle: {
    boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.08)',
    borderRadius: '16px',
  },
} as WidgetConfig;
