import { useSyncWagmiConfig } from '@lifi/wallet-management'
import { ChainId, ChainType, useAvailableChains } from '@lifi/widget'
import { useEffect } from 'react'
import { WagmiProvider } from 'wagmi'
import { appKit, wagmiAdapter } from '../config/appkit'
import { chainToAppKitNetworks } from '../utils/appkit'
import { SolanaProvider } from './SolanaProvider'

const { wagmiConfig } = wagmiAdapter

export function ReownEVMWalletProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { chains } = useAvailableChains()

  useEffect(() => {
    const evmChains = chains?.filter(
      (chain) => chain.chainType === ChainType.EVM && chain.id !== ChainId.ETH
    )
    const evmNetworks = chainToAppKitNetworks(evmChains || [])
    evmNetworks.map((network) => appKit.addNetwork('eip155', network))
  }, [chains])

  useSyncWagmiConfig(wagmiConfig, [], chains)

  return (
    <WagmiProvider config={wagmiConfig} reconnectOnMount={true}>
      {children}
    </WagmiProvider>
  )
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
  return (
    <ReownEVMWalletProvider>
      <SolanaProvider>{children}</SolanaProvider>
    </ReownEVMWalletProvider>
  )
}
