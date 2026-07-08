import type { CreateConnectorFn } from '@bigmi/client'
import type { Client } from '@bigmi/core'
import type { SDKProvider } from '@lifi/sdk'
import type { SDKProviderFactory } from '@lifi/widget-provider'

export interface BitcoinProviderDeps {
  getWalletClient: () => Promise<Client>
}

export interface BitcoinProviderConfig {
  sdkProvider?: SDKProvider | SDKProviderFactory<BitcoinProviderDeps>
  /** Extra Bigmi connectors to append to the defaults (e.g. `metamask()`). */
  connectors?: CreateConnectorFn[]
}
