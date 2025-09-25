import { useAppKitAccount, useWalletInfo } from '@reown/appkit/react'
import type { Adapter, WalletName } from '@solana/wallet-adapter-base'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import {
  ConnectionProvider,
  useWallet,
  WalletProvider,
} from '@solana/wallet-adapter-react'
import { clusterApiUrl } from '@solana/web3.js'

import { type FC, type PropsWithChildren, useEffect } from 'react'

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
  const { isConnected } = useAppKitAccount({ namespace: 'solana' })
  const { walletInfo } = useWalletInfo('solana')

  const { select, wallet, disconnect, disconnecting } = useWallet()

  useEffect(() => {
    if (isConnected && !wallet && walletInfo?.name) {
      const walletName =
        walletInfo?.type === 'WALLET_CONNECT'
          ? 'WalletConnect'
          : walletInfo?.name
      select(walletName as WalletName)
    }

    if (!isConnected && wallet && !disconnecting) {
      disconnect()
    }
  }, [select, isConnected, walletInfo, wallet, disconnect, disconnecting])

  return null
}
