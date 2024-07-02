import type { WidgetConfig } from '@lifi/widget';
import { LiFiWidget } from '@lifi/widget';

export default function Widget() {
  const config = {
    appearance: 'light',
    theme: {
      container: {
        boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.08)',
        borderRadius: '16px',
      },
    },
  } as Partial<WidgetConfig>;

  return <LiFiWidget config={config} integrator="nextjs-example" />;
}
