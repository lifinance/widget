import { LiFiWidget } from '@lifi/widget'
import { BitcoinProvider } from '@lifi/widget-provider-bitcoin'
import { EthereumProvider } from '@lifi/widget-provider-ethereum'
import { SolanaProvider } from '@lifi/widget-provider-solana'
import { SuiProvider } from '@lifi/widget-provider-sui'
import { useEmbeddedWidgetConfig } from './providers/WidgetConfigProvider.js'

const IFRAME_PROVIDERS = [
  EthereumProvider(),
  SolanaProvider(),
  BitcoinProvider(),
  SuiProvider(),
]

/**
 * Guest (iframe) app.
 *
 * Connection lifecycle:
 *  1. WidgetConfigProvider listens for INIT and stores the widget config.
 *  2. WalletProvider creates a wagmi config with widgetLightIframe() and
 *     syncs chains from the LI.FI API via useSyncWagmiConfig.
 *  3. The connector's setup() creates the EthereumIframeProvider which sends
 *     READY to the host and awaits INIT with ecosystem states.
 *  4. When INIT arrives the connector emits wagmi 'connect' and the widget
 *     config context updates, rendering this component.
 *  5. Non-EVM providers (Solana, Bitcoin, Sui) receive their init state from
 *     the ecosystems[] array in the INIT message.
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
