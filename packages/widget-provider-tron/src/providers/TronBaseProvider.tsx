import type { Adapter } from '@tronweb3/tronwallet-abstract-adapter'
import { WalletProvider } from '@tronweb3/tronwallet-adapter-react-hooks'
import { type FC, type PropsWithChildren, useRef } from 'react'
import { createTronAdapters } from '../config/adapters.js'
import type { TronProviderConfig } from '../types.js'

interface TronBaseProviderProps {
  config?: TronProviderConfig
}

export const TronBaseProvider: FC<PropsWithChildren<TronBaseProviderProps>> = ({
  config: _config,
  children,
}) => {
  const adapters = useRef<Adapter[]>(null)

  if (!adapters.current) {
    // TODO: Re-enable WalletConnect once @tronweb3/tronwallet-adapters fixes
    // the "No accounts found in session" error. The upstream adapter (v1.2.24)
    // uses requiredNamespaces which WalletConnect v2 demotes to optional,
    // causing sessions to complete with zero Tron accounts.
    adapters.current = createTronAdapters()
  }

  return <WalletProvider adapters={adapters.current}>{children}</WalletProvider>
}
