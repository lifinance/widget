import { useAppKitAccount } from '@reown/appkit/react'
import type { WalletName } from '@reown/appkit-adapter-solana/react'
import type { Adapter } from '@solana/wallet-adapter-base'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import {
  ConnectionProvider,
  useWallet,
  WalletProvider,
} from '@solana/wallet-adapter-react'
import { clusterApiUrl } from '@solana/web3.js'
import { type FC, type PropsWithChildren, useEffect } from 'react'
import { appKit } from '../config/appkit'

const endpoint = clusterApiUrl(WalletAdapterNetwork.Mainnet)
/**
 * Can be empty because wallets from Reown will be used
 */
const wallets: Adapter[] = []

export const SolanaConnectedWalletKey = 'li.fi-widget-recent-wallet'

export const SolanaProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider
        wallets={wallets}
        localStorageKey={SolanaConnectedWalletKey}
        autoConnect
      >
        <SolanaReownHandler />
        {children}
      </WalletProvider>
    </ConnectionProvider>
  )
}

export const SolanaReownHandler: FC = () => {
  const account = useAppKitAccount({ namespace: 'solana' })

  const { disconnect, select } = useWallet()

  useEffect(() => {
    if (account.isConnected) {
      const connectors = appKit.getConnectors('solana')
      select(connectors[0].name as WalletName)
    } else {
      disconnect()
    }
  }, [account, disconnect, select])

  return null
}
