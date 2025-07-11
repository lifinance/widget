import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { CoinbaseWalletAdapter } from '@solana/wallet-adapter-coinbase'
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react'
import { clusterApiUrl } from '@solana/web3.js'
import { WalletConnectWalletAdapter } from '@walletconnect/solana-adapter'
import { type FC, type PropsWithChildren, useMemo } from 'react'
import { defaultWalletConnectConfig } from '../../config/walletConnect'
import { useWidgetConfig } from '../WidgetProvider/WidgetProvider'

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
// const wallets: Adapter[] = [
//   new WalletConnectWalletAdapter({
//     network: WalletAdapterNetwork.Mainnet,
//     options: walletConfig?.walletConnect ?? defaultWalletConnectConfig,
//   }),
//   new CoinbaseWalletAdapter(),
// ]

export const SVMBaseProvider: FC<PropsWithChildren> = ({ children }) => {
  const { walletConfig } = useWidgetConfig()
  const wallets = useMemo(() => {
    return [
      new WalletConnectWalletAdapter({
        network: WalletAdapterNetwork.Mainnet,
        options: {
          ...(walletConfig?.walletConnect ?? defaultWalletConnectConfig),
        },
      }),
      new CoinbaseWalletAdapter(),
    ]
  }, [walletConfig])

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        {children}
      </WalletProvider>
    </ConnectionProvider>
  )
}
