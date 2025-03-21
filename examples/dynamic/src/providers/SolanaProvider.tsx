import {
  type Wallet,
  useDynamicContext,
  useDynamicEvents,
} from '@dynamic-labs/sdk-react-core'
import type { SolanaWalletConnector } from '@dynamic-labs/solana'
import type { Adapter } from '@solana/wallet-adapter-base'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'

import {
  ConnectionProvider,
  WalletProvider,
  useWallet,
} from '@solana/wallet-adapter-react'
import { clusterApiUrl } from '@solana/web3.js'
import { type FC, type PropsWithChildren, useEffect } from 'react'
import { initialize } from '../adapters/dynamic'

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
        <SolanaDynamicHandler />
        {children}
      </WalletProvider>
    </ConnectionProvider>
  )
}

const getSolanaConnector = (
  wallet: Wallet | null
): SolanaWalletConnector | undefined => {
  if (wallet?.connector.connectedChain === 'SOL') {
    return wallet.connector as SolanaWalletConnector
  }
}

export const SolanaDynamicHandler: FC = () => {
  const { disconnect, select, wallets } = useWallet()

  const { primaryWallet } = useDynamicContext()
  useDynamicEvents('logout', () => {
    disconnect()
  })

  useEffect(() => {
    if (primaryWallet?.connector.connectedChain !== 'SOL') {
      disconnect()
    }
  }, [primaryWallet, disconnect])

  const solanaWallet = getSolanaConnector(primaryWallet)

  useEffect(() => {
    const handleConnectedSolanaWallet = async () => {
      if (!solanaWallet) {
        return
      }

      const wallet = wallets.find(
        (wallet) => wallet.adapter.name === solanaWallet.name
      )
      if (wallet) {
        select(wallet.adapter.name)
      } else {
        const signer = await solanaWallet.getSigner()
        signer && initialize(signer)
      }
    }

    handleConnectedSolanaWallet()
  }, [solanaWallet, select, wallets])

  return null
}
