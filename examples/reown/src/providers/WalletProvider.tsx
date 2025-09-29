import { ChainType, type ExtendedChain, useAvailableChains } from '@lifi/widget'
import { bitcoin, mainnet, solana } from '@reown/appkit/networks'
import {
  type AppKit,
  createAppKit,
  useAppKitAccount,
  useAppKitNetwork,
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

    const solanaWeb3JsAdapter = new SolanaAdapter({
      registerWalletStandard: true,
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
      defaultNetwork: mainnet,
    })
    wagmi.current = wagmiAdapter
    modal.current = appKit
  }

  const { wagmiConfig } = wagmi.current

  const { isConnected } = useAppKitAccount()
  const { isConnected: isEvmConnected } = useAppKitAccount({
    namespace: 'eip155',
  })
  const { isConnected: isSolanaConnected } = useAppKitAccount({
    namespace: 'solana',
  })
  const { caipNetwork } = useAppKitNetwork()
  const { setCaipNetwork, getActiveChainNamespace, getCaipNetwork } =
    modal.current

  // In multichain mode, Appkit fails to update the main connection state correctly after one chain is disconnected, or a page reload
  // If there is mismatch between main connection state and eth connection state, we manually update the main state accordingly
  // Details here: https://github.com/reown-com/appkit/issues/5066
  useEffect(() => {
    if (isConnected) {
      const activeChainNamespace = getActiveChainNamespace()
      setCaipNetwork(
        caipNetwork || getCaipNetwork(activeChainNamespace || 'eip155')
      )
    } else {
      if (isEvmConnected) {
        setCaipNetwork(getCaipNetwork('eip155'))
      }
      if (isSolanaConnected) {
        setCaipNetwork(getCaipNetwork('solana'))
      }
    }
  }, [
    setCaipNetwork,
    caipNetwork,
    getActiveChainNamespace,
    getCaipNetwork,
    isConnected,
    isEvmConnected,
    isSolanaConnected,
  ])

  return (
    <WagmiProvider config={wagmiConfig} reconnectOnMount={true}>
      {children}
    </WagmiProvider>
  )
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
