import type { WidgetConfig } from '@lifi/widget';
import { LiFiWidget } from '@lifi/widget';

export const widgetConfig: Partial<WidgetConfig> = {
  containerStyle: {
    border: `1px solid rgb(234, 234, 234)`,
    borderRadius: '16px',
  },
};

export function App() {
  return <LiFiWidget config={widgetConfig} integrator="vite-example" />;
}
