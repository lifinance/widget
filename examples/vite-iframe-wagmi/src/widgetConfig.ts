import type { WidgetLightConfig } from '@lifi/widget-light'

export const widgetConfig: WidgetLightConfig = {
  integrator: 'vite-iframe-example',
  variant: 'wide',
  theme: {
    container: {
      border: '1px solid rgb(234, 234, 234)',
      borderRadius: '16px',
    },
  },
  sdkConfig: {
    routeOptions: {
      maxPriceImpact: 0.4,
    },
  },
}
