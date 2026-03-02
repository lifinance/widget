import type { WidgetLightConfig } from '@lifi/widget-light'

/**
 * Widget configuration sent to the iframe.
 * Must be JSON-serialisable — no React nodes or callback functions.
 */
export const widgetConfig: WidgetLightConfig = {
  integrator: 'vite-iframe-example',
  theme: {
    container: {
      border: '1px solid rgb(234, 234, 234)',
      borderRadius: '16px',
    },
  },
}
