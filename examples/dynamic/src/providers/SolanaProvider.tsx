import type { Adapter } from '@solana/wallet-adapter-base'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'

import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react'
import { clusterApiUrl } from '@solana/web3.js'
import type { FC, PropsWithChildren } from 'react'
import { DynamicSolanaProvider } from './DynamicSolanaProvider.js'

const endpoint = clusterApiUrl(WalletAdapterNetwork.Mainnet)
/**
 * Can be empty because wallets from Dynamic will be used
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
        <DynamicSolanaProvider>{children}</DynamicSolanaProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}
