import { useSyncWagmiConfig } from '@lifi/widget-provider-ethereum'
import { PrivyProvider } from '@privy-io/react-auth'
import { WagmiProvider } from '@privy-io/wagmi'
import { QueryClientProvider } from '@tanstack/react-query'
import type { FC, PropsWithChildren } from 'react'
import { type Chain, mainnet } from 'viem/chains'
import { PRIVY_APP_ID, PRIVY_CLIENT_ID, privyConfig } from '../config/privy.js'
import { queryClient } from '../config/queryClient.js'
import { wagmiConfig } from '../config/wagmi.js'
import { useChains } from '../hooks/useChains.js'
import { SolanaProvider } from './SolanaProvider.js'

export const WalletProvider: FC<PropsWithChildren> = ({ children }) => {
  const { chains, evmChains } = useChains()

  const supportedChains: Chain[] = evmChains ?? [mainnet]

  useSyncWagmiConfig(wagmiConfig, [], chains)

  return (
    <PrivyProvider
      appId={PRIVY_APP_ID}
      clientId={PRIVY_CLIENT_ID}
      config={{
        ...privyConfig,
        defaultChain: mainnet,
        supportedChains,
      }}
    >
      <QueryClientProvider client={queryClient}>
        <SolanaProvider>
          <WagmiProvider config={wagmiConfig} reconnectOnMount={false}>
            {children}
          </WagmiProvider>
        </SolanaProvider>
      </QueryClientProvider>
    </PrivyProvider>
  )
}
