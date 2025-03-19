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
/**
 * Wallets that implement either of these standards will be available automatically.
 *
 *   - Solana Mobile Stack Mobile Wallet Adapter Protocol
 *     (https://github.com/solana-mobile/mobile-wallet-adapter)
 *   - Solana Wallet Standard
 *     (https://github.com/solana-labs/wallet-standard)
 *
 * If you wish to support a wallet that supports neither of those standards,
 * instantiate its legacy wallet adapter here. Common legacy adapters can be found
 * in the npm package `@solana/wallet-adapter-wallets`.
 */
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
  const { disconnect, select } = useWallet()
  useEffect(() => {
    emitter.on('connect', async (connectorName) => {
      select(connectorName as WalletName)
    })
    emitter.on('disconnect', async () => {
      await disconnect()
    })
    return () => emitter.all.clear()
  }, [disconnect, select])
  return null
}
