import { WalletProvider } from '@tronweb3/tronwallet-adapter-react-hooks'
import {
  BitKeepAdapter,
  BybitWalletAdapter,
  FoxWalletAdapter,
  GateWalletAdapter,
  ImTokenAdapter,
  OkxWalletAdapter,
  TokenPocketAdapter,
  TronLinkAdapter,
  TrustAdapter,
  // WalletConnectAdapter,
} from '@tronweb3/tronwallet-adapters'
import { type FC, type PropsWithChildren, useMemo } from 'react'
// import { useAvailableChains } from '../../hooks/useAvailableChains.js'

export const TVMBaseProvider: FC<PropsWithChildren> = ({ children }) => {
  // const { chains } = useAvailableChains()

  // TODO: update adapters based on chains?
  const adapters = useMemo(
    () => [
      new BitKeepAdapter(),
      new BybitWalletAdapter(),
      new TrustAdapter(),
      new TronLinkAdapter(),
      new FoxWalletAdapter(),
      new GateWalletAdapter(),
      new ImTokenAdapter(),
      new OkxWalletAdapter(),
      new TokenPocketAdapter(),
      // new WalletConnectAdapter({
      //   network: 'mainnet',
      //   options: {
      //     projectId: 'your-project-id', // TODO: configure this
      //     metadata: {
      //       name: 'LiFi Widget',
      //       description: 'LiFi Widget for Tron',
      //       url: 'https://li.fi',
      //       icons: ['https://li.fi/favicon.ico'],
      //     },
      //   },
      // }),
    ],
    []
  )

  return (
    <WalletProvider
      autoConnect
      adapters={adapters}
      localStorageKey="li.fi-widget-tron-wallet-connection"
    >
      {children}
    </WalletProvider>
  )
}
