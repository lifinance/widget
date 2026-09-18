import type { CreateConnectorFn } from '@bigmi/client'
import type { Client } from '@bigmi/core'
import type { SDKProvider } from '@lifi/sdk'
import type { SDKProviderFactory } from '@lifi/widget-provider'

export interface BitcoinProviderDeps {
  getWalletClient: () => Promise<Client>
}

export interface BitcoinProviderConfig {
  sdkProvider?: SDKProvider | SDKProviderFactory<BitcoinProviderDeps>
  /**
   * Extra Bigmi connectors to append to the defaults. A connector is offered
   * when its `getProvider()` resolves to a provider; one that resolves nothing
   * or throws is treated as unavailable and hidden. Passing a connector that is
   * already a default is ignored.
   */
  connectors?: CreateConnectorFn[]
}
