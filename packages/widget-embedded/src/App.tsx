import { LiFiWidget } from '@lifi/widget'
import { EthereumProvider } from '@lifi/widget-provider-ethereum'
import { useEmbeddedWidgetConfig } from './providers/WidgetConfigProvider.js'

/**
 * Providers injected locally — these are React component factories that cannot
 * be serialised over postMessage. Only EthereumProvider is included because the
 * host bridge (`useWidgetLightHost`) is EVM-only (wagmi WalletClient / PublicClient).
 *
 * EthereumProvider detects the existing WagmiContext supplied by WalletProvider
 * and uses it as an external context, so the widgetLightIframe connector is
 * picked up automatically without creating a second wagmi instance.
 */
const IFRAME_PROVIDERS = [EthereumProvider()]

/**
 * Guest (iframe) app.
 *
 * Connection lifecycle:
 *  1. WidgetConfigProvider listens for INIT and stores the widget config.
 *  2. WalletProvider creates a wagmi config with widgetLightIframe() and
 *     syncs chains from the LI.FI API via useSyncWagmiConfig.
 *  3. The connector's setup() creates the IframeProvider which sends READY
 *     to the host and awaits INIT with accounts + chainId.
 *  4. When INIT arrives the connector emits wagmi 'connect' and the widget
 *     config context updates, rendering this component.
 */
export function App() {
  const widgetConfig = useEmbeddedWidgetConfig()

  if (!widgetConfig) {
    return null
  }

  return (
    <LiFiWidget
      integrator={(widgetConfig.integrator as string) ?? 'widget-embedded'}
      providers={IFRAME_PROVIDERS}
      config={widgetConfig}
    />
  )
}
