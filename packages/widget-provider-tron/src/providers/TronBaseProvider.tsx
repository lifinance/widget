import { resolveConfig } from '@lifi/widget-provider'
import { WalletProvider } from '@tronweb3/tronwallet-adapter-react-hooks'
import {
  BitKeepAdapter,
  BybitWalletAdapter,
  FoxWalletAdapter,
  GateWalletAdapter,
  ImTokenAdapter,
  MetaMaskAdapter,
  OkxWalletAdapter,
  TokenPocketAdapter,
  TronLinkAdapter,
  TrustAdapter,
  WalletConnectAdapter,
} from '@tronweb3/tronwallet-adapters'
import { type FC, type PropsWithChildren, useMemo } from 'react'
import { defaultTronWalletConnectConfig } from '../config/walletConnect.js'
import type { TronProviderConfig } from '../types.js'

interface TronBaseProviderProps {
  config?: TronProviderConfig
}

export const TronBaseProvider: FC<PropsWithChildren<TronBaseProviderProps>> = ({
  config,
  children,
}) => {
  const walletConnectConfig = resolveConfig(
    config?.walletConnect,
    defaultTronWalletConnectConfig
  )

  const adapters = useMemo(
    () => [
      new MetaMaskAdapter(),
      new BitKeepAdapter(),
      new BybitWalletAdapter(),
      new TrustAdapter(),
      new TronLinkAdapter(),
      new FoxWalletAdapter(),
      new GateWalletAdapter(),
      new ImTokenAdapter(),
      new OkxWalletAdapter(),
      new TokenPocketAdapter(),
      ...(walletConnectConfig
        ? [new WalletConnectAdapter(walletConnectConfig)]
        : []),
    ],
    [walletConnectConfig]
  )

  return <WalletProvider adapters={adapters}>{children}</WalletProvider>
}
