import { useSyncWagmiConfig } from '@lifi/wallet-management'
import { ChainType, type ExtendedChain } from '@lifi/widget'
import { mainnet, solana } from '@reown/appkit/networks'
import { type AppKit, createAppKit } from '@reown/appkit/react'
import { SolanaAdapter } from '@reown/appkit-adapter-solana'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import type { AppKitNetwork } from '@reown/appkit-common'
import { useEffect, useRef } from 'react'
import { WagmiProvider } from 'wagmi'
import { useThemeMode } from '../../hooks/useThemeMode'
import { chainToAppKitNetworks, getChainImagesConfig } from '../../utils/appkit'
import { useEnvVariables } from '../EnvVariablesProvider'
import { SolanaProvider } from './SolanaProvider'

const metadata = {
  name: 'LI.FI Widget Playground',
  description: 'LI.FI Widget Playground',
  url: 'https://li.fi',
  icons: ['https://avatars.githubusercontent.com/u/85288935'],
}

export function ReownWalletProvider({
  children,
  chains,
}: {
  children: React.ReactNode
  chains: ExtendedChain[]
}) {
  const { EVMWalletConnectId } = useEnvVariables()
  const wagmi = useRef<WagmiAdapter | undefined>(undefined)
  const modal = useRef<AppKit | undefined>(undefined)
  const { themeMode } = useThemeMode()

  if (!wagmi.current || !modal.current) {
    const networks: [AppKitNetwork, ...AppKitNetwork[]] = [solana]
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
    const solanaAdapter = new SolanaAdapter()

    const appKit = createAppKit({
      adapters: [wagmiAdapter, solanaAdapter],
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
      <SolanaProvider>{children}</SolanaProvider>
    </WagmiProvider>
  )
}
