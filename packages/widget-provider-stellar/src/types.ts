import type { SDKProvider } from '@lifi/sdk'
import type { StellarWallet } from '@lifi/sdk-provider-stellar'
import type { SDKProviderFactory } from '@lifi/widget-provider'

export interface StellarProviderDeps {
  getWallet: () => Promise<StellarWallet>
  /**
   * The network the kit was initialized with. Balance reads resolve their
   * network from the provider options, not from the connected wallet, so a
   * custom `sdkProvider` has to forward this to stay on the same network it
   * signs on.
   */
  networkPassphrase: string
}

export interface StellarProviderConfig {
  sdkProvider?: SDKProvider | SDKProviderFactory<StellarProviderDeps>
}
