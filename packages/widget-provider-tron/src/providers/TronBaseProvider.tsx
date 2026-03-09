import { resolveConfig } from '@lifi/widget-provider'
import { WalletProvider } from '@tronweb3/tronwallet-adapter-react-hooks'
import {
  BinanceWalletAdapter,
  BitKeepAdapter,
  BybitWalletAdapter,
  FoxWalletAdapter,
  GateWalletAdapter,
  GuardaAdapter,
  ImTokenAdapter,
  LedgerAdapter,
  MetaMaskAdapter,
  OkxWalletAdapter,
  TokenPocketAdapter,
  TomoWalletAdapter,
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
      new BinanceWalletAdapter(),
      new BitKeepAdapter(),
      new BybitWalletAdapter(),
      new FoxWalletAdapter(),
      new GateWalletAdapter(),
      new GuardaAdapter(),
      new ImTokenAdapter(),
      new LedgerAdapter(),
      new MetaMaskAdapter(),
      new OkxWalletAdapter(),
      new TokenPocketAdapter(),
      new TomoWalletAdapter(),
      new TronLinkAdapter(),
      new TrustAdapter(),
      ...(walletConnectConfig
        ? [new WalletConnectAdapter(walletConnectConfig)]
        : []),
    ],
    [walletConnectConfig]
  )

  return <WalletProvider adapters={adapters}>{children}</WalletProvider>
}
