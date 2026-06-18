import type { Adapter } from '@tronweb3/tronwallet-abstract-adapter'
import { WalletProvider } from '@tronweb3/tronwallet-adapter-react-hooks'
import { type FC, type PropsWithChildren, useRef } from 'react'
import { createTronAdapters } from '../config/adapters.js'
import { resolveTronWalletConnectConfig } from '../config/walletConnect.js'
import type { TronProviderConfig } from '../types.js'

interface TronBaseProviderProps {
  config?: TronProviderConfig
}

export const TronBaseProvider: FC<PropsWithChildren<TronBaseProviderProps>> = ({
  config,
  children,
}) => {
  const adapters = useRef<Adapter[]>(null)

  if (!adapters.current) {
    adapters.current = createTronAdapters(
      resolveTronWalletConnectConfig(config?.walletConnect)
    )
  }

  return <WalletProvider adapters={adapters.current}>{children}</WalletProvider>
}
