import type { Client } from '@bigmi/core'
import type { SDKProvider } from '@lifi/sdk'
import type { SDKProviderFactory } from '@lifi/widget-provider'

export interface BitcoinProviderDeps {
  getWalletClient: () => Promise<Client>
}

export interface BitcoinProviderConfig {
  sdkProvider?: SDKProvider | SDKProviderFactory<BitcoinProviderDeps>
}
