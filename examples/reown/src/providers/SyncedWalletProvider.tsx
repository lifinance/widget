import { useSyncWagmiConfig } from '@lifi/wallet-management'
import { ChainType, type ExtendedChain, useAvailableChains } from '@lifi/widget'
import { BitcoinAdapter } from '@reown/appkit-adapter-bitcoin'
import { SolanaAdapter } from '@reown/appkit-adapter-solana'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import type { AppKitNetwork } from '@reown/appkit-common'
import { bitcoin, solana } from '@reown/appkit/networks'
import { type AppKit, createAppKit } from '@reown/appkit/react'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets'
import { useEffect, useRef } from 'react'
import { WagmiProvider } from 'wagmi'
import { metadata, projectId } from '../config/appkit'
import { chainToAppKitNetworks, getChainImagesConfig } from '../utils/appkit'
import { SolanaProvider, emitter } from './SolanaProvider'

export function WalletProvider({
  children,
  chains,
}: { children: React.ReactNode; chains: ExtendedChain[] }) {
  const wagmi = useRef<WagmiAdapter | undefined>(undefined)
  const modal = useRef<AppKit | undefined>(undefined)

  const networks: [AppKitNetwork, ...AppKitNetwork[]] = [solana, bitcoin]

  if (!wagmi.current || !modal.current) {
    const evmChains = chains.filter(
      (chain) => chain.chainType === ChainType.EVM
    )
    const evmNetworks = chainToAppKitNetworks(evmChains)
    networks.push(...evmNetworks)

    const chainImages = getChainImagesConfig(evmChains)

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
      chainImages,
      themeMode: 'light',
    })

    wagmi.current = wagmiAdapter
    modal.current = appKit
  }

  const { wagmiConfig } = wagmi.current

  useSyncWagmiConfig(wagmiConfig, [], chains)

  useEffect(() => {
    const appKit = modal.current
    if (appKit) {
      const unsubscribe = appKit.subscribeNetwork((network) => {
        if (network.caipNetwork) {
          const { chainNamespace } = network.caipNetwork
          if (chainNamespace === 'solana') {
            const connectors = appKit.getConnectors(chainNamespace)
            // We use the first connector in the list as there's no way to get the active connector from appKit yet.
            emitter.emit('connect', connectors[0].name)
          } else {
            emitter.emit('disconnect')
          }
          appKit.close()
        }
      })

      return () => unsubscribe()
    }
  }, [])

  return (
    <WagmiProvider config={wagmiConfig} reconnectOnMount={false}>
      {children}
    </WagmiProvider>
  )
}

export function SyncedWalletProvider({
  children,
}: { children: React.ReactNode }) {
  // fetch available chains before rendering the WalletProvider
  const { chains, isLoading } = useAvailableChains()

  if (!chains || isLoading) {
    return null
  }

  if (!chains.length) {
    return null
  }

  return (
    <WalletProvider chains={chains}>
      <SolanaProvider>{children}</SolanaProvider>
    </WalletProvider>
  )
}
