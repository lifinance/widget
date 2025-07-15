import {
  useDynamicContext,
  useDynamicEvents,
  type Wallet,
} from '@dynamic-labs/sdk-react-core'
import type { SolanaWalletConnector } from '@dynamic-labs/solana'
import { useWallet } from '@solana/wallet-adapter-react'
import { type FC, type PropsWithChildren, useEffect } from 'react'
import { initialize } from '../adapters/dynamic'

/**
 *
 * This function extracts the solana connector from a dynamic wallet, and returns it
 *
 * @param wallet A dynamic wallet object
 * @returns A SolanaWalletConnector or null if the connected chain of the wallet is not SOL
 */
const getSolanaConnector = (
  wallet: Wallet | null
): SolanaWalletConnector | undefined => {
  if (wallet?.connector.connectedChain === 'SOL') {
    return wallet.connector as SolanaWalletConnector
  }
}

/**
 * This Provider gets the wallet from the dynamic context, and connects it to our dapp using the solana adapter
 */
export const DynamicSolanaProvider: FC<PropsWithChildren> = ({ children }) => {
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

  return children
}
