import { createConfig, dynamic } from '@bigmi/client'
import { bitcoin } from '@bigmi/core'
import { BigmiProvider } from '@bigmi/react'
import { type BitcoinWallet, isBitcoinWallet } from '@dynamic-labs/bitcoin'
import { type Wallet, useDynamicContext } from '@dynamic-labs/sdk-react-core'
import { ChainId } from '@lifi/widget'
import { type FC, type PropsWithChildren, useEffect, useMemo } from 'react'
import { http, createClient } from 'viem'

const bigmiConfig = createConfig({
  chains: [bitcoin],
  ssr: true,
  multiInjectedProviderDiscovery: false,
  client: ({ chain }) =>
    createClient({ chain: chain as any, transport: http() }) as any,
  connectors: [],
})

const getBitcoinWallet = (wallet: Wallet | null): BitcoinWallet | undefined => {
  if (!wallet) {
    return
  }
  if (isBitcoinWallet(wallet)) {
    return wallet as BitcoinWallet
  }
}

export const DynamicUTXOProvider: FC<PropsWithChildren> = ({ children }) => {
  const { primaryWallet } = useDynamicContext()

  const bitcoinWallet = getBitcoinWallet(primaryWallet)

  const connector = useMemo(() => {
    if (!bitcoinWallet) {
      return
    }

    const connector = bigmiConfig._internal.connectors.setup(
      dynamic({
        chainId: ChainId.BTC,
        wallet: bitcoinWallet as any,
      })
    )
    return connector
  }, [bitcoinWallet])

  useEffect(() => {
    const syncConnection = async () => {
      if (connector) {
        bigmiConfig._internal.connectors.setState([connector])
        const accounts = await connector.getAccounts()
        bigmiConfig._internal.events.connect({
          accounts,
          chainId: ChainId.BTC,
          uid: connector.uid,
        })
      } else {
        bigmiConfig._internal.connectors.setState([])
        bigmiConfig.setState((state) => ({
          ...state,
          connections: new Map(),
        }))
      }
    }

    syncConnection()
  }, [connector])

  return (
    <BigmiProvider config={bigmiConfig} reconnectOnMount={false}>
      {children}
    </BigmiProvider>
  )
}
