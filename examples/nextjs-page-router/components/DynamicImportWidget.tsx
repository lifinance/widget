import type { WidgetConfig } from '@lifi/widget'
import { LiFiWidget } from '@lifi/widget'

// NOTE: this example of the widget is for use with the nexts next/dynamic api
// see pages/dynamic-import.tsx for usage
export default function DynamicImportWidget() {
  const config = {
    appearance: 'light',
    theme: {
      container: {
        boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.08)',
        borderRadius: '16px',
      },
    },
  } as Partial<WidgetConfig>

  return <LiFiWidget config={config} integrator="nextjs-example" />
}
