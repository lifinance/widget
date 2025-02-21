import {
  convertExtendedChain,
  isExtendedChain,
  useSyncWagmiConfig,
} from '@lifi/wallet-management'
import { useAvailableChains } from '@lifi/widget'
import { PrivyProvider } from '@privy-io/react-auth'
import { WagmiProvider } from '@privy-io/wagmi'
import { QueryClientProvider } from '@tanstack/react-query'
import type { FC, PropsWithChildren } from 'react'
import { type Chain, mainnet } from 'viem/chains'
import { PRIVY_APP_ID, privyConfig } from '../config/privy'
import { queryClient } from '../config/queryClient'
import { wagmiConfig } from '../config/wagmi'

export const WalletProvider: FC<PropsWithChildren> = ({ children }) => {
  const { chains } = useAvailableChains()

  const supportedChains: Chain[] = (chains?.map((chain) =>
    isExtendedChain(chain) ? convertExtendedChain(chain) : chain
  ) as [Chain, ...Chain[]]) || [mainnet]

  useSyncWagmiConfig(wagmiConfig, [], chains)

  return (
    <PrivyProvider
      appId={PRIVY_APP_ID}
      config={{
        ...privyConfig,
        defaultChain: mainnet,
        supportedChains,
      }}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmiConfig} reconnectOnMount={false}>
          {children}
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  )
}
