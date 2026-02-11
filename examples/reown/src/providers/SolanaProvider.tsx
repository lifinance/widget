import { useAppKitAccount, useWalletInfo } from '@reown/appkit/react'
import type { WalletName } from '@solana/wallet-adapter-base'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import {
  ConnectionProvider,
  useWallet,
  WalletProvider,
} from '@solana/wallet-adapter-react'
import { clusterApiUrl } from '@solana/web3.js'
import { type FC, type PropsWithChildren, useEffect } from 'react'

const endpoint = clusterApiUrl(WalletAdapterNetwork.Mainnet)

export const SolanaProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={[]} autoConnect={false}>
        <SolanaReownHandler />
        {children}
      </WalletProvider>
    </ConnectionProvider>
  )
}

export const SolanaReownHandler: FC = () => {
  const { isConnected: isAppKitConnected } = useAppKitAccount({
    namespace: 'solana',
  })
  const { walletInfo: appKitWalletInfo } = useWalletInfo('solana')

  const {
    select,
    wallet: adapterWallet,
    disconnect,
    disconnecting,
    connected: isAdapterConnected,
    connect,
    connecting,
  } = useWallet()

  useEffect(() => {
    const walletName =
      appKitWalletInfo?.type === 'WALLET_CONNECT'
        ? 'WalletConnect'
        : appKitWalletInfo?.name

    const shouldConnect =
      isAppKitConnected && !isAdapterConnected && !connecting && walletName
    const shouldDisconnect =
      !isAppKitConnected && isAdapterConnected && !disconnecting

    if (shouldConnect) {
      const isWalletSelected = adapterWallet?.adapter.name === walletName
      if (isWalletSelected) {
        connect().catch(console.error)
      } else {
        select(walletName as WalletName)
      }
    }

    if (shouldDisconnect) {
      disconnect()
    }
  }, [
    isAppKitConnected,
    isAdapterConnected,
    connecting,
    disconnecting,
    appKitWalletInfo,
    adapterWallet,
    select,
    connect,
    disconnect,
  ])

  return null
}
