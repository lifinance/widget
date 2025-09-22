import { useSyncWagmiConfig } from '@lifi/wallet-management'
import { ChainId, ChainType, useAvailableChains } from '@lifi/widget'
import { useAppKitAccount } from '@reown/appkit/react'
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

  const { isConnected, status } = useAppKitAccount()
  const { isConnected: ethIsConnected } = useAppKitAccount({
    namespace: 'eip155',
  })

  useEffect(() => {
    const evmChains = chains?.filter(
      (chain) => chain.chainType === ChainType.EVM && chain.id !== ChainId.ETH
    )
    const evmNetworks = chainToAppKitNetworks(evmChains || [])
    evmNetworks.map((network) => appKit.addNetwork('eip155', network))
  }, [chains])

  useEffect(() => {
    // if eth is connected and main state is not connect, switch namespace to eth
    // fixes the connection sync issue
    if (!isConnected && ethIsConnected && status === 'disconnected') {
      appKit.setCaipNetwork(appKit.getCaipNetwork('eip155'))
    }
  }, [isConnected, ethIsConnected, status])

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
