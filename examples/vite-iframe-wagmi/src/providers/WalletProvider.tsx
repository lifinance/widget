import type { FC, PropsWithChildren } from 'react'
import { createClient, http } from 'viem'
import { arbitrum, base, mainnet, optimism, polygon } from 'viem/chains'
import { createConfig, WagmiProvider } from 'wagmi'
import { injected } from 'wagmi/connectors'

const config = createConfig({
  chains: [mainnet, arbitrum, optimism, base, polygon],
  connectors: [injected()],
  client({ chain }) {
    return createClient({ chain, transport: http() })
  },
  multiInjectedProviderDiscovery: true,
  ssr: false,
})

export const WalletProvider: FC<PropsWithChildren> = ({ children }) => (
  <WagmiProvider config={config}>{children}</WagmiProvider>
)
