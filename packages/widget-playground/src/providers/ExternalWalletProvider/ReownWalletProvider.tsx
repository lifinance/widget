import { ChainType, type ExtendedChain } from '@lifi/widget'
import { useSyncWagmiConfig } from '@lifi/widget-provider-ethereum'
import { createTronAdapters } from '@lifi/widget-provider-tron'
import { bitcoin, mainnet, solana, tronMainnet } from '@reown/appkit/networks'
import { type AppKit, createAppKit } from '@reown/appkit/react'
import { BitcoinAdapter } from '@reown/appkit-adapter-bitcoin'
import { SolanaAdapter } from '@reown/appkit-adapter-solana'
import { TronAdapter } from '@reown/appkit-adapter-tron'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import type { AppKitNetwork } from '@reown/appkit-common'
import type { ChainAdapter } from '@reown/appkit-controllers'
import type { JSX } from 'react'
import { useEffect, useRef } from 'react'
import { WagmiProvider } from 'wagmi'
import { useThemeMode } from '../../hooks/useThemeMode.js'
import {
  chainToAppKitNetworks,
  getChainImagesConfig,
} from '../../utils/appkit.js'
import { useEnvVariables } from '../EnvVariablesProvider.js'
import { BitcoinProvider } from './BitcoinProvider.js'
import { SolanaProvider } from './SolanaProvider.js'
import { TronReownProvider } from './TronReownProvider.js'

const metadata = {
  name: 'LI.FI Widget Playground',
  description: 'LI.FI Widget Playground',
  url: 'https://li.fi',
  icons: ['https://avatars.githubusercontent.com/u/85288935'],
}

const tronWalletAdapters = createTronAdapters()

export function ReownWalletProvider({
  children,
  chains,
}: {
  children: React.ReactNode
  chains: ExtendedChain[]
}): JSX.Element {
  const { EVMWalletConnectId } = useEnvVariables()
  const wagmi = useRef<WagmiAdapter | undefined>(undefined)
  const modal = useRef<AppKit | undefined>(undefined)
  const { themeMode } = useThemeMode()

  if (!wagmi.current || !modal.current) {
    // The prebuilt networks of @reown/appkit carry the hook phases of an older viem;
    // viem 2.57.17 adds `afterFillTransactionError`. The difference is in types only.
    const networks = [solana, bitcoin, tronMainnet] as [
      AppKitNetwork,
      ...AppKitNetwork[],
    ]
    const evmChains = chains.filter(
      (chain) => chain.chainType === ChainType.EVM
    )
    const evmNetworks = chainToAppKitNetworks(evmChains)
    networks.push(...evmNetworks)

    const chainImages = getChainImagesConfig(evmChains)

    const wagmiAdapter = new WagmiAdapter({
      networks: evmNetworks,
      projectId: EVMWalletConnectId,
      ssr: false,
    })
    const solanaAdapter = new SolanaAdapter({ registerWalletStandard: true })

    const bitcoinAdapter = new BitcoinAdapter({
      projectId: EVMWalletConnectId,
    })

    const tronAdapter = new TronAdapter({ walletAdapters: tronWalletAdapters })

    const adapters: ChainAdapter[] = [
      wagmiAdapter,
      solanaAdapter,
      bitcoinAdapter,
      tronAdapter,
    ]

    const appKit = createAppKit({
      adapters,
      networks,
      projectId: EVMWalletConnectId,
      metadata,
      chainImages,
      features: {
        socials: false,
        email: false,
      },
      themeMode,
      defaultNetwork: mainnet,
    })
    wagmi.current = wagmiAdapter
    modal.current = appKit
  }

  const { wagmiConfig } = wagmi.current

  useSyncWagmiConfig(wagmiConfig, [], chains)

  useEffect(() => {
    const appKit = modal.current
    if (appKit) {
      appKit.setThemeMode(themeMode)
    }
  }, [themeMode])

  return (
    <WagmiProvider config={wagmiConfig} reconnectOnMount={false}>
      <SolanaProvider>
        <BitcoinProvider>
          <TronReownProvider adapters={tronWalletAdapters}>
            {children}
          </TronReownProvider>
        </BitcoinProvider>
      </SolanaProvider>
    </WagmiProvider>
  )
}
