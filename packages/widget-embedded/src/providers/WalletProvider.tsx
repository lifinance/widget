import type { WidgetConfig } from '@lifi/widget'
import { useWidgetChains } from '@lifi/widget'
import { widgetLightIframe } from '@lifi/widget-light'
import { useSyncWagmiConfig } from '@lifi/widget-provider-ethereum'
import { type FC, type PropsWithChildren, useMemo, useRef } from 'react'
import { createClient, http } from 'viem'
import { mainnet } from 'viem/chains'
import type { Config, CreateConnectorFn } from 'wagmi'
import { createConfig, WagmiProvider } from 'wagmi'
import { useEmbeddedWidgetConfig } from './WidgetConfigProvider.js'

const FALLBACK_CONFIG: Partial<WidgetConfig> = {
  integrator: 'widget-embedded',
}

export const WalletProvider: FC<PropsWithChildren> = ({ children }) => {
  const widgetConfig = useEmbeddedWidgetConfig()
  const { chains } = useWidgetChains(
    (widgetConfig ?? FALLBACK_CONFIG) as WidgetConfig
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
      connectors: [iframeConnectorFn.current],
      multiInjectedProviderDiscovery: false,
      ssr: false,
    })
  }

  useSyncWagmiConfig(wagmi.current, connectors, chains)

  return (
    <WagmiProvider config={wagmi.current} reconnectOnMount={false}>
      {children}
    </WagmiProvider>
  )
}
