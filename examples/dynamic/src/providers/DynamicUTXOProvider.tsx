import { createConfig, dynamic } from '@bigmi/client'
import { bitcoin, ChainId, createClient, http } from '@bigmi/core'
import { BigmiProvider } from '@bigmi/react'
import { type BitcoinWallet, isBitcoinWallet } from '@dynamic-labs/bitcoin'
import { useDynamicContext, type Wallet } from '@dynamic-labs/sdk-react-core'
import { type FC, type PropsWithChildren, useEffect, useMemo } from 'react'

const bigmiConfig = createConfig({
  chains: [bitcoin],
  client: ({ chain }) => createClient({ chain, transport: http() }),
  multiInjectedProviderDiscovery: true,
  ssr: true,
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
          chainId: ChainId.BITCOIN_MAINNET,
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
