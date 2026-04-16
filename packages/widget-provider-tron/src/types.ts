import type { SDKProvider } from '@lifi/sdk'
import type { SDKProviderFactory } from '@lifi/widget-provider'
import type { Adapter } from '@tronweb3/tronwallet-abstract-adapter'
import type { WalletConnectAdapterConfig } from '@tronweb3/tronwallet-adapters'

export interface TronProviderDeps {
  getWallet: () => Promise<Adapter>
}

export interface TronProviderConfig {
  walletConnect?: WalletConnectAdapterConfig | boolean
  sdkProvider?: SDKProvider | SDKProviderFactory<TronProviderDeps>
}
