import type { SDKProvider } from '@lifi/sdk'
import type { SDKProviderFactory } from '@lifi/widget-provider'
import type { Wallet } from '@wallet-standard/base'

export interface SolanaProviderDeps {
  getWallet: () => Promise<Wallet>
}

export interface SolanaProviderConfig {
  sdkProvider?: SDKProvider | SDKProviderFactory<SolanaProviderDeps>
}
