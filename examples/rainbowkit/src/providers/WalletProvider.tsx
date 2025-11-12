import { useSyncWagmiConfig } from '@lifi/wallet-management'
import { useAvailableChains } from '@lifi/widget'
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
