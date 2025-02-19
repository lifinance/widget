import { useSyncWagmiConfig } from '@lifi/wallet-management'
import { ChainType, type ExtendedChain, useAvailableChains } from '@lifi/widget'
import { BitcoinAdapter } from '@reown/appkit-adapter-bitcoin'
import { SolanaAdapter } from '@reown/appkit-adapter-solana'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import type { AppKitNetwork } from '@reown/appkit-common'
import { bitcoin, solana } from '@reown/appkit/networks'
import { createAppKit } from '@reown/appkit/react'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets'
import { useRef } from 'react'
import { type Config, type CreateConnectorFn, WagmiProvider } from 'wagmi'
import { metadata, projectId } from '../config/appkit'
import { chainToAppKitNetworks } from '../utils/appkit'
import { SolanaProvider, emitter } from './SolanaProvider'

const connectors: CreateConnectorFn[] = []

export function WalletProvider({
  children,
  chains,
}: { children: React.ReactNode; chains: ExtendedChain[] }) {
  const wagmi = useRef<Config | undefined>(undefined)
  const networks: [AppKitNetwork, ...AppKitNetwork[]] = [solana, bitcoin]

  if (!wagmi.current) {
    const evmNetworks = chainToAppKitNetworks(
      chains.filter((chain) => chain.chainType === ChainType.EVM)
    )
    networks.push(...evmNetworks)

    const wagmiAdapter = new WagmiAdapter({
      networks: evmNetworks,
      projectId,
      ssr: true,
    })

    const solanaWeb3JsAdapter = new SolanaAdapter({
      wallets: [new PhantomWalletAdapter()],
    })

    const bitcoinAdapter = new BitcoinAdapter({
      projectId,
    })

    const appKit = createAppKit({
      adapters: [wagmiAdapter, solanaWeb3JsAdapter, bitcoinAdapter],
      networks,
      projectId,
      metadata,
      themeMode: 'light',
    })

    appKit.subscribeCaipNetworkChange((caipNetwork) => {
      if (caipNetwork) {
        const { chainNamespace } = caipNetwork
        if (chainNamespace === 'solana') {
          const connectors = appKit.getConnectors(chainNamespace)
          // there's no way to get the active connector from appKit yet.
          emitter.emit('connect', connectors[0].name)
        } else {
          emitter.emit('disconnect')
        }
      }
    })

    wagmi.current = wagmiAdapter.wagmiConfig
  }

  useSyncWagmiConfig(wagmi.current, connectors, chains)

  return (
    <WagmiProvider config={wagmi.current} reconnectOnMount={false}>
      {children}
    </WagmiProvider>
  )
}

export function SyncedWalletProvider({
  children,
}: { children: React.ReactNode }) {
  // fetch available chains before rendering the WalletProvider
  const { chains, isLoading } = useAvailableChains()

  if (!chains && isLoading) {
    return null
  }

  return (
    chains && (
      <WalletProvider chains={chains}>
        <SolanaProvider>{children}</SolanaProvider>
      </WalletProvider>
    )
  )
}
