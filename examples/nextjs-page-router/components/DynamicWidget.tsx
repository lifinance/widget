import type { WidgetConfig } from '@lifi/widget'
import { LiFiWidget } from '@lifi/widget'
import { EthereumProvider } from '@lifi/widget-provider-ethereum'

export default function DynamicWidget() {
  const config = {
    appearance: 'light',
    theme: {
      container: {
        border: '1px solid rgb(234, 234, 234)',
        borderRadius: '16px',
      },
    },
  } as Partial<WidgetConfig>

  return (
    <LiFiWidget
      config={config}
      integrator="nextjs-example"
      providers={[EthereumProvider()]}
    />
  )
}
