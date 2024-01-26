import { WidgetConfig } from '@lifi/widget';

export const defaultWidgetConfig: Partial<WidgetConfig> = {
  theme: {
    palette: { primary: { main: '#FF0000' } },
  },
  containerStyle: {
    border: `1px solid rgb(234, 234, 234)`,
    borderRadius: '16px',
  },
};
