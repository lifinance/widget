import type { WalletConnectAdapterConfig } from '@tronweb3/tronwallet-adapters'

export interface TronProviderConfig {
  walletConnect?: WalletConnectAdapterConfig | boolean
}
