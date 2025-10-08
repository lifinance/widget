import { useAvailableChains } from '@lifi/widget'
import {
  convertExtendedChain,
  isExtendedChain,
  useSyncWagmiConfig,
} from '@lifi/widget-provider-ethereum'
import { PrivyProvider } from '@privy-io/react-auth'
import { SmartWalletsProvider } from '@privy-io/react-auth/smart-wallets'
import { WagmiProvider } from '@privy-io/wagmi'
import { QueryClientProvider } from '@tanstack/react-query'
import type { FC, PropsWithChildren } from 'react'
import { type Chain, mainnet } from 'viem/chains'
import { PRIVY_APP_ID, privyConfig } from '../config/privy'
import { queryClient } from '../config/queryClient'
import { wagmiConfig } from '../config/wagmi'
import { SolanaProvider } from './SolanaProvider'

export const WalletProvider: FC<PropsWithChildren> = ({ children }) => {
  const { chains } = useAvailableChains()

  const supportedChains: Chain[] = (chains?.map((chain) =>
    isExtendedChain(chain) ? convertExtendedChain(chain) : chain
  ) as [Chain, ...Chain[]]) || [mainnet]

  useSyncWagmiConfig(wagmiConfig, [], chains)

  return (
    <PrivyProvider
      appId={PRIVY_APP_ID}
      // clientId={PRIVY_CLIENT_ID}
      config={{
        ...privyConfig,
        defaultChain: mainnet,
        supportedChains,
      }}
    >
      <SmartWalletsProvider>
        <QueryClientProvider client={queryClient}>
          <SolanaProvider>
            <WagmiProvider config={wagmiConfig} reconnectOnMount={false}>
              {children}
            </WagmiProvider>
          </SolanaProvider>
        </QueryClientProvider>
      </SmartWalletsProvider>
    </PrivyProvider>
  )
}
