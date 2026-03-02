import { injected, walletConnect } from '@wagmi/connectors'
import { type FC, type PropsWithChildren, useEffect, useRef } from 'react'
import { createClient, http } from 'viem'
import { mainnet } from 'viem/chains'
import type { Config } from 'wagmi'
import { createConfig, WagmiProvider } from 'wagmi'
import { reconnect } from 'wagmi/actions'
import { useChains } from '../hooks/useChains'

const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID as
  | string
  | undefined

const connectors = [
  injected(),
  ...(projectId ? [walletConnect({ projectId })] : []),
]

/**
 * Host-side WalletProvider.
 *
 * Uses standard injected + WalletConnect connectors — the parent window owns
 * the real wallet. EVM chains are fetched directly from the LI.FI API so that
 * wallet_switchEthereumChain requests forwarded by the guest can succeed.
 */
export const HostWalletProvider: FC<PropsWithChildren> = ({ children }) => {
  const { chains } = useChains()
  const wagmi = useRef<Config>(null)

  if (!wagmi.current) {
    wagmi.current = createConfig({
      chains: [mainnet],
      client({ chain }) {
        return createClient({ chain, transport: http() })
      },
      multiInjectedProviderDiscovery: true,
      ssr: false,
    })
  }

  useEffect(() => {
    if (!chains?.length || !wagmi.current) {
      return
    }
    const typed = chains as unknown as readonly [
      (typeof chains)[0],
      ...(typeof chains)[number][],
    ]
    wagmi.current._internal.chains.setState(typed)
    wagmi.current._internal.connectors.setState(() =>
      [
        ...connectors,
        ...(wagmi
          .current!._internal.mipd?.getProviders()
          .map(wagmi.current!._internal.connectors.providerDetailToConnector) ??
          []),
      ].map(wagmi.current!._internal.connectors.setup)
    )
    reconnect(wagmi.current)
  }, [chains])

  return (
    <WagmiProvider config={wagmi.current} reconnectOnMount={false}>
      {children}
    </WagmiProvider>
  )
}
