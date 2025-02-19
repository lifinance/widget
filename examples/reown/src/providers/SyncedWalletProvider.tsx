import { createAppKit } from '@reown/appkit/react'

import { useSyncWagmiConfig } from '@lifi/wallet-management'
import { type ExtendedChain, useAvailableChains } from '@lifi/widget'
import { BitcoinAdapter } from '@reown/appkit-adapter-bitcoin'
import { SolanaAdapter } from '@reown/appkit-adapter-solana'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import type { AppKitNetwork } from '@reown/appkit-common'
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from '@solana/wallet-adapter-wallets'
import { useRef } from 'react'
import { type Config, type CreateConnectorFn, WagmiProvider } from 'wagmi'
import { metadata, projectId } from '../config/appkit'
import { chainToAppKitNetworks } from '../utils/appkit'
import { SolanaProvider } from './SolanaProvider'

const connectors: CreateConnectorFn[] = []

export function WalletProvider({
  children,
  chains,
}: { children: React.ReactNode; chains: ExtendedChain[] }) {
  const wagmi = useRef<Config | undefined>(undefined)

  if (!wagmi.current) {
    const formattedNetworks = chainToAppKitNetworks(chains)
    const networks: [AppKitNetwork, ...AppKitNetwork[]] = [
      formattedNetworks[0],
      ...formattedNetworks.slice(1, -1),
    ]

    const wagmiAdapter = new WagmiAdapter({
      networks,
      projectId,
      ssr: true,
    })

    const solanaWeb3JsAdapter = new SolanaAdapter({
      wallets: [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
    })

    const bitcoinAdapter = new BitcoinAdapter({
      projectId,
    })

    createAppKit({
      adapters: [wagmiAdapter, solanaWeb3JsAdapter, bitcoinAdapter],
      networks,
      projectId,
      metadata,
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
  console.log({
    chains,
  })

  if (!chains && isLoading) {
    return null
  }

  return (
    chains && (
      <WalletProvider chains={chains}>
        <SolanaProvider> {children} </SolanaProvider>
      </WalletProvider>
    )
  )
}
