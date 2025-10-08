import { useAvailableChains } from '@lifi/widget'
import { useSyncWagmiConfig } from '@lifi/widget-provider-ethereum'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import type { FC, PropsWithChildren } from 'react'
import { WagmiProvider } from 'wagmi'
import { config } from '../config/wagmi'

export const WalletProvider: FC<PropsWithChildren> = ({ children }) => {
  const { chains } = useAvailableChains()

  useSyncWagmiConfig(config, [], chains)
  return (
    <WagmiProvider config={config}>
      <RainbowKitProvider>{children}</RainbowKitProvider>
    </WagmiProvider>
  )
}
