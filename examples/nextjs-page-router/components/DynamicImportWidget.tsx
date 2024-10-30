import type { WidgetConfig } from '@lifi/widget'
import { LiFiWidget } from '@lifi/widget'

// NOTE: this example of the widget is for use with the nexts next/dynamic api
// see pages/dynamic-import.tsx for usage
export default function DynamicImportWidget() {
  const config = {
    appearance: 'light',
    theme: {
      container: {
        border: '1px solid rgb(234, 234, 234)',
        borderRadius: '16px',
      },
    },
  } as Partial<WidgetConfig>

  return <LiFiWidget config={config} integrator="nextjs-example" />
}
