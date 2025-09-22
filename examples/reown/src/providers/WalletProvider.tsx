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
    if (ethIsConnected) {
      // close wallet connect modal as eth is connected
      appKit.close()

      // In multichain mode, Appkit fails to update the connection state correctly after one chain is disconnected
      // If there is mismatch between main connection state and eth connection state, we manually update the main state
      // Details here: https://github.com/reown-com/appkit/issues/5066
      if (!isConnected && status === 'disconnected') {
        appKit.setCaipNetwork(appKit.getCaipNetwork('eip155'))
      }
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
