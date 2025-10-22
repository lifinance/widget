import { LiFiWidget } from '@lifi/widget'
import { EthereumProvider } from '@lifi/widget-provider-ethereum'
import { useWidgetConfig } from '../store/useWidgetConfig.ts'

export function WidgetView() {
  const { config } = useWidgetConfig()
  return (
    <LiFiWidget
      integrator="vite-example"
      config={config}
      providers={[EthereumProvider()]}
    />
  )
}
