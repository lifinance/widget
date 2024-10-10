import type { WidgetConfig } from '@lifi/widget'
import './index.css'

export const widgetBaseConfig: WidgetConfig = {
  subvariant: 'custom',
  integrator: 'li.fi-playground',
  hiddenUI: ['history'],
  // buildUrl: true,
  sdkConfig: {
    apiUrl: 'https://li.quest/v1',
    routeOptions: {
      // maxPriceImpact: 0.4,
    },
  },
}

export const widgetConfig: WidgetConfig = {
  ...widgetBaseConfig,
  theme: {
    container: {
      boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.08)',
      borderRadius: '16px',
    },
  },
}
