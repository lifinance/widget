import type { Provider as SolanaWalletProvider } from '@reown/appkit-adapter-solana'
import { useAppKitProvider } from '@reown/appkit/react'
import type { Adapter, WalletName } from '@solana/wallet-adapter-base'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import {
  ConnectionProvider,
  WalletProvider,
  useWallet,
} from '@solana/wallet-adapter-react'
import { clusterApiUrl } from '@solana/web3.js'
import mitt, { type Emitter } from 'mitt'
import { type FC, type PropsWithChildren, useEffect } from 'react'

const endpoint = clusterApiUrl(WalletAdapterNetwork.Mainnet)
const wallets: Adapter[] = []

type WalletEvents = {
  connect: string
  disconnect: unknown
}

export const SolanaConnectedWalletKey = 'li.fi-widget-recent-wallet'

export const emitter: Emitter<WalletEvents> = mitt<WalletEvents>()

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
  const { walletProvider: solanaProvider } =
    useAppKitProvider<SolanaWalletProvider>('solana')
  const { disconnect, select } = useWallet()
  useEffect(() => {
    if (solanaProvider?.name) {
      select(solanaProvider.name as WalletName)
    }
    return () => {
      disconnect()
    }
  }, [disconnect, select, solanaProvider?.name])
  return null
}
