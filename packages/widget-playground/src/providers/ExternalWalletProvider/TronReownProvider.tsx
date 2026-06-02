import { useAppKitProvider, useAppKitState } from '@reown/appkit/react'
import type {
  Adapter,
  AdapterName,
} from '@tronweb3/tronwallet-abstract-adapter'
import {
  useWallet,
  WalletProvider,
} from '@tronweb3/tronwallet-adapter-react-hooks'
import { type FC, type PropsWithChildren, useEffect } from 'react'

type TronAppKitWalletProvider = { name?: string }

function TronReownSync(): null {
  const { walletProvider } = useAppKitProvider<TronAppKitWalletProvider>('tron')
  const { initialized } = useAppKitState()
  const { select, disconnect, wallets } = useWallet()

  const providerName =
    typeof walletProvider?.name === 'string' ? walletProvider.name : undefined

  useEffect(() => {
    if (!initialized) {
      return
    }

    if (providerName && wallets.some((w) => w.adapter.name === providerName)) {
      select(providerName as AdapterName)
    } else {
      void disconnect()
    }
  }, [initialized, providerName, wallets, select, disconnect])

  return null
}

interface TronReownProviderProps extends PropsWithChildren {
  adapters: Adapter[]
}

export const TronReownProvider: FC<TronReownProviderProps> = ({
  adapters,
  children,
}) => {
  if (adapters.length === 0) {
    return children
  }
  return (
    <WalletProvider
      adapters={adapters}
      autoConnect={false}
      disableAutoConnectOnLoad
    >
      <TronReownSync />
      {children}
    </WalletProvider>
  )
}
