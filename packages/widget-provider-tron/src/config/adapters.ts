import type { Adapter } from '@tronweb3/tronwallet-abstract-adapter'
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
} from '@tronweb3/tronwallet-adapters'

export const createTronAdapters = (): Adapter[] => [
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
]
