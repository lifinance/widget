import { ChainType, type ExtendedChain, useAvailableChains } from '@lifi/widget'
import { bitcoin, mainnet, solana } from '@reown/appkit/networks'
import {
  type AppKit,
  createAppKit,
  useAppKitAccount,
} from '@reown/appkit/react'
import { BitcoinAdapter } from '@reown/appkit-adapter-bitcoin'
import { SolanaAdapter } from '@reown/appkit-adapter-solana'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import type { AppKitNetwork } from '@reown/appkit-common'

import { useEffect, useRef } from 'react'
import { WagmiProvider } from 'wagmi'
import { metadata, projectId } from '../config/appkit'
import { chainToAppKitNetworks, getChainImagesConfig } from '../utils/appkit'
import { SolanaProvider } from './SolanaProvider'

export function ReownEVMWalletProvider({
  children,
  chains,
}: {
  children: React.ReactNode
  chains: ExtendedChain[]
}) {
  const wagmi = useRef<WagmiAdapter | undefined>(undefined)
  const modal = useRef<AppKit | undefined>(undefined)

  if (!wagmi.current || !modal.current) {
    const networks: [AppKitNetwork, ...AppKitNetwork[]] = [solana, bitcoin]
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

    const solanaWeb3JsAdapter = new SolanaAdapter()

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
      defaultNetwork: mainnet,
    })
    wagmi.current = wagmiAdapter
    modal.current = appKit
  }

  const { wagmiConfig } = wagmi.current

  return (
    <WagmiProvider config={wagmiConfig} reconnectOnMount={true}>
      <SyncAppKitMainState appKit={modal.current} />
      {children}
    </WagmiProvider>
  )
}

function SyncAppKitMainState({ appKit }: { appKit: AppKit }) {
  const { isConnected, status } = useAppKitAccount()
  const { isConnected: evmIsConnected } = useAppKitAccount({
    namespace: 'eip155',
  })

  const { setCaipNetwork, getCaipNetwork } = appKit

  useEffect(() => {
    if (!isConnected && status === 'disconnected' && evmIsConnected) {
      setCaipNetwork(getCaipNetwork('eip155'))
    }
  }, [isConnected, status, evmIsConnected, setCaipNetwork, getCaipNetwork])

  return null
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
  // fetch available chains before rendering the WalletProvider
  const { chains, isLoading } = useAvailableChains()

  if (!chains || isLoading) {
    return null
  }

  if (!chains.length) {
    return null
  }

  return (
    <ReownEVMWalletProvider chains={chains}>
      <SolanaProvider>{children}</SolanaProvider>
    </ReownEVMWalletProvider>
  )
}
