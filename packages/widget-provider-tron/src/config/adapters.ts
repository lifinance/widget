import type { Adapter } from '@tronweb3/tronwallet-abstract-adapter'
// Import each adapter from its individual `@tronweb3/tronwallet-adapter-*` package
// rather than the `@tronweb3/tronwallet-adapters` barrel. The barrel re-exports
// `@tronweb3/tronwallet-adapter-ledger-evm` (added in 1.3.1), whose `@ledgerhq`
// deps pull the `Buffer` global; in consumer Vite builds that makes Rolldown
// resolve `vite-plugin-node-polyfills`' malformed `./shims/buffer/` export and
// fail. The widget doesn't use the Ledger adapter, so importing directly keeps
// it out of the bundle.
import { BinanceWalletAdapter } from '@tronweb3/tronwallet-adapter-binance'
import { BitKeepAdapter } from '@tronweb3/tronwallet-adapter-bitkeep'
import { BybitWalletAdapter } from '@tronweb3/tronwallet-adapter-bybit'
import { FoxWalletAdapter } from '@tronweb3/tronwallet-adapter-foxwallet'
import { GateWalletAdapter } from '@tronweb3/tronwallet-adapter-gatewallet'
import { GuardaAdapter } from '@tronweb3/tronwallet-adapter-guarda'
import { ImTokenAdapter } from '@tronweb3/tronwallet-adapter-imtoken'
import { MetaMaskAdapter } from '@tronweb3/tronwallet-adapter-metamask-tron'
import { OkxWalletAdapter } from '@tronweb3/tronwallet-adapter-okxwallet'
import { TokenPocketAdapter } from '@tronweb3/tronwallet-adapter-tokenpocket'
import { TronLinkAdapter } from '@tronweb3/tronwallet-adapter-tronlink'
import { TrustAdapter } from '@tronweb3/tronwallet-adapter-trust'
import {
  WalletConnectAdapter,
  type WalletConnectAdapterConfig,
} from '@tronweb3/tronwallet-adapter-walletconnect'

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
  new TronLinkAdapter(),
  new TrustAdapter(),
  ...(walletConnect ? [new WalletConnectAdapter(walletConnect)] : []),
]
