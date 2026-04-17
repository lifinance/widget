import type { Config } from '@bigmi/client'
import { createConfig, reown } from '@bigmi/client'
import { bitcoin, ChainId, createClient, http } from '@bigmi/core'
import { BigmiProvider } from '@bigmi/react'
import {
  useAppKitAccount,
  useAppKitProvider,
  useWalletInfo,
} from '@reown/appkit/react'
import type { BitcoinConnector } from '@reown/appkit-adapter-bitcoin'
import { type FC, type PropsWithChildren, useEffect } from 'react'

const bigmiConfig = createConfig({
  chains: [bitcoin],
  client: ({ chain }) => createClient({ chain, transport: http() }),
  multiInjectedProviderDiscovery: false,
  ssr: true,
}) as Config

const BitcoinReownHandler: FC<PropsWithChildren> = ({ children }) => {
  const { isConnected, address } = useAppKitAccount({ namespace: 'bip122' })
  const { walletProvider } = useAppKitProvider<BitcoinConnector>('bip122')
  const { walletInfo } = useWalletInfo('bip122')

  useEffect(() => {
    if (!isConnected || !walletProvider || !address) {
      bigmiConfig._internal.connectors.setState([])
      bigmiConfig.setState((state) => ({ ...state, connections: new Map() }))
      return
    }

    const connector = bigmiConfig._internal.connectors.setup(
      reown({
        connector: walletProvider,
        walletInfo,
        address,
      })
    )

    bigmiConfig._internal.connectors.setState([connector])

    connector.getAccounts().then((accounts) => {
      bigmiConfig._internal.events.connect({
        accounts,
        chainId: ChainId.BITCOIN_MAINNET,
        uid: connector.uid,
      })
    })
  }, [isConnected, walletProvider, address, walletInfo])

  return <>{children}</>
}

export const BitcoinProvider: FC<PropsWithChildren> = ({ children }) => (
  <BigmiProvider config={bigmiConfig} reconnectOnMount={true}>
    <BitcoinReownHandler>{children}</BitcoinReownHandler>
  </BigmiProvider>
)
