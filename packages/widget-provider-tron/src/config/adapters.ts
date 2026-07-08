import type { Adapter } from '@tronweb3/tronwallet-abstract-adapter'
import {
  BinanceWalletAdapter,
  BitKeepAdapter,
  BybitWalletAdapter,
  FoxWalletAdapter,
  GateWalletAdapter,
  GuardaAdapter,
  ImTokenAdapter,
  MetaMaskAdapter,
  OkxWalletAdapter,
  TokenPocketAdapter,
  TomoWalletAdapter,
  TronLinkAdapter,
  TrustAdapter,
  WalletConnectAdapter,
  type WalletConnectAdapterConfig,
} from '@tronweb3/tronwallet-adapters'

export const createTronAdapters = (
  walletConnect?: WalletConnectAdapterConfig
): Adapter[] => [
  new BinanceWalletAdapter(),
  new BitKeepAdapter(),
  new BybitWalletAdapter(),
  new FoxWalletAdapter(),
  new GateWalletAdapter(),
  new GuardaAdapter(),
  new ImTokenAdapter(),
  new MetaMaskAdapter(),
  new OkxWalletAdapter(),
  new TokenPocketAdapter(),
  new TomoWalletAdapter(),
  new TronLinkAdapter(),
  new TrustAdapter(),
  ...(walletConnect ? [new WalletConnectAdapter(walletConnect)] : []),
]
