import type { WidgetConfig } from '@lifi/widget'
import { useWidgetChains } from '@lifi/widget'
import { useSyncWagmiConfig } from '@lifi/widget-provider-ethereum'
import { type FC, type PropsWithChildren, useMemo, useRef } from 'react'
import { createClient, http } from 'viem'
import { mainnet } from 'viem/chains'
import type { Config, CreateConnectorFn } from 'wagmi'
import { createConfig, WagmiProvider } from 'wagmi'
import { widgetLightConnector as widgetLightIframe } from './iframe/widgetLightConnector.js'
import {
  EMBEDDED_DEFAULT_CONFIG,
  useEmbeddedWidgetConfig,
} from './WidgetConfigProvider.js'

export const WalletProvider: FC<PropsWithChildren> = ({ children }) => {
  const widgetConfig = useEmbeddedWidgetConfig()
  const { chains } = useWidgetChains(
    (widgetConfig ?? EMBEDDED_DEFAULT_CONFIG) as WidgetConfig
  )

  const iframeConnectorFn = useRef<CreateConnectorFn>(null)
  if (!iframeConnectorFn.current) {
    iframeConnectorFn.current = widgetLightIframe()
  }
  const connectors = useMemo(() => [iframeConnectorFn.current!], [])

  const wagmi = useRef<Config>(null)
  if (!wagmi.current) {
    wagmi.current = createConfig({
      chains: [mainnet],
      client({ chain }) {
        return createClient({ chain, transport: http() })
      },
      connectors: [iframeConnectorFn.current!],
      multiInjectedProviderDiscovery: false,
      ssr: false,
      // Disable localStorage persistence. The embedded widget receives wallet
      // state from the host via postMessage (INIT/EVENT). Wagmi's Hydrate
      // component calls onMount() on every non-SSR render and when
      // reconnectOnMount=false it clears connections if storage is present.
      storage: null,
    })
  }

  useSyncWagmiConfig(wagmi.current, connectors, chains)

  return (
    <WagmiProvider config={wagmi.current} reconnectOnMount={false}>
      {children}
    </WagmiProvider>
  )
}
