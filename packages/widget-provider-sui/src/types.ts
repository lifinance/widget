import type { SDKProvider } from '@lifi/sdk'
import type { SDKProviderFactory } from '@lifi/widget-provider'
import type { ClientWithCoreApi } from '@mysten/sui/client'
import type { Signer } from '@mysten/sui/cryptography'

export interface SuiProviderDeps {
  getClient: () => Promise<ClientWithCoreApi>
  getSigner: () => Promise<Signer>
}

export interface SuiProviderConfig {
  sdkProvider?: SDKProvider | SDKProviderFactory<SuiProviderDeps>
}
