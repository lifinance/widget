import { resolveConfig } from '@lifi/widget-provider'
import type { Adapter } from '@tronweb3/tronwallet-abstract-adapter'
import { WalletProvider } from '@tronweb3/tronwallet-adapter-react-hooks'
import { WalletConnectAdapter } from '@tronweb3/tronwallet-adapters'
import { type FC, type PropsWithChildren, useRef } from 'react'
import { createTronAdapters } from '../config/adapters.js'
import { defaultTronWalletConnectConfig } from '../config/walletConnect.js'
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
    const walletConnectConfig = resolveConfig(
      config?.walletConnect,
      defaultTronWalletConnectConfig
    )
    adapters.current = [
      ...createTronAdapters(),
      ...(walletConnectConfig
        ? [new WalletConnectAdapter(walletConnectConfig)]
        : []),
    ]
  }

  return <WalletProvider adapters={adapters.current}>{children}</WalletProvider>
}
