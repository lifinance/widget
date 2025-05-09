import { useSyncWagmiConfig } from '@lifi/wallet-management'
import { ChainType, useAvailableChains } from '@lifi/widget'
import { ConnectKitProvider, getDefaultConfig } from 'connectkit'
import type { FC, PropsWithChildren } from 'react'
import { WagmiProvider, createConfig } from 'wagmi'
import { mainnet } from 'wagmi/chains'
import { walletConnectProjectId } from '../config/connectkit'

const wagmiConfig = createConfig(
  getDefaultConfig({
    // Your dApps chains
    chains: [mainnet],

    // Required API Keys
    walletConnectProjectId: walletConnectProjectId,

    // Required App Info
    appName: 'lifi-connectkit-widget-example',

    // Optional App Info
    appDescription: 'LI.FI Widget ConnectKit Example',
    appUrl: 'https://li.fi', // your app's url
    appIcon: 'https://avatars.githubusercontent.com/u/85288935', // your app's icon, no bigger than 1024x1024px (max. 1MB)
  })
)

export const WalletProvider: FC<PropsWithChildren> = ({ children }) => {
  const { chains } = useAvailableChains()

  const evmChains = chains?.filter((chain) => chain.chainType === ChainType.EVM)

  useSyncWagmiConfig(wagmiConfig, [], evmChains)
  return (
    <WagmiProvider config={wagmiConfig}>
      <ConnectKitProvider>{children}</ConnectKitProvider>
    </WagmiProvider>
  )
}
