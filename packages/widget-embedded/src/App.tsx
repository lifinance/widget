import { LiFiWidget } from '@lifi/widget'
import { EthereumProvider } from '@lifi/widget-provider-ethereum'
import type { JSX, PropsWithChildren } from 'react'
import { BitcoinIframeProviderValues } from './providers/iframe/BitcoinIframeProviderValues.js'
import { SolanaIframeProviderValues } from './providers/iframe/SolanaIframeProviderValues.js'
import { SuiIframeProviderValues } from './providers/iframe/SuiIframeProviderValues.js'
import { TronIframeProviderValues } from './providers/iframe/TronIframeProviderValues.js'
import { useEmbeddedWidgetConfig } from './providers/WidgetConfigProvider.js'
import { WidgetEventsBridge } from './providers/WidgetEventsBridge.js'

const IFRAME_PROVIDERS = [
  EthereumProvider(),
  ({ children }: PropsWithChildren) => (
    <SolanaIframeProviderValues>{children}</SolanaIframeProviderValues>
  ),
  ({ children }: PropsWithChildren) => (
    <BitcoinIframeProviderValues>{children}</BitcoinIframeProviderValues>
  ),
  ({ children }: PropsWithChildren) => (
    <SuiIframeProviderValues>{children}</SuiIframeProviderValues>
  ),
  ({ children }: PropsWithChildren) => (
    <TronIframeProviderValues>{children}</TronIframeProviderValues>
  ),
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
export function App(): JSX.Element | null {
  const widgetConfig = useEmbeddedWidgetConfig()

  if (!widgetConfig) {
    return null
  }

  return (
    <>
      <WidgetEventsBridge />
      <LiFiWidget
        integrator={(widgetConfig.integrator as string) ?? 'widget-embedded'}
        providers={IFRAME_PROVIDERS}
        config={widgetConfig}
      />
    </>
  )
}
