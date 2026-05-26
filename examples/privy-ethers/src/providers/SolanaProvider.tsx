import type { Adapter, WalletName } from '@solana/wallet-adapter-base'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import {
  ConnectionProvider,
  useWallet,
  WalletProvider,
} from '@solana/wallet-adapter-react'
import { clusterApiUrl } from '@solana/web3.js'
import EventEmitter from 'eventemitter3'
import { type FC, type PropsWithChildren, useEffect } from 'react'

const endpoint = clusterApiUrl(WalletAdapterNetwork.Mainnet)
/**
 * Can be empty because wallets from Privy will be used
 */
const wallets: Adapter[] = []

export const SolanaConnectedWalletKey = 'li.fi-widget-recent-wallet'

type WalletEvents = {
  connect: (connectorName: string) => void
  disconnect: () => void
}

export const emitter: EventEmitter<WalletEvents> =
  new EventEmitter<WalletEvents>()

export const SolanaProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider
        wallets={wallets}
        localStorageKey={SolanaConnectedWalletKey}
        autoConnect
      >
        <SolanaHandler />
        {children}
      </WalletProvider>
    </ConnectionProvider>
  )
}

export const SolanaHandler: FC = () => {
  const { disconnect, select } = useWallet()
  useEffect(() => {
    emitter.on('connect', async (connectorName) => {
      select(connectorName as WalletName)
    })
    emitter.on('disconnect', async () => {
      await disconnect()
    })
    return () => emitter.removeAllListeners()
  }, [disconnect, select])
  return null
}
