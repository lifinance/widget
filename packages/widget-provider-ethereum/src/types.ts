import type { SDKProvider } from '@lifi/sdk'
import type { SDKProviderFactory } from '@lifi/widget-provider'
import type { Client } from 'viem'
import type { CreateConnectorFn } from 'wagmi'
import type {
  BaseAccountParameters,
  CoinbaseWalletParameters,
  MetaMaskParameters,
  PortoParameters,
  WalletConnectParameters,
} from 'wagmi/connectors'

export interface CreateConnectorFnExtended extends CreateConnectorFn {
  id: string
  displayName: string
}

export interface EthereumProviderDeps {
  getWalletClient: () => Promise<Client>
  switchChain: (chainId: number) => Promise<Client | undefined>
  disableMessageSigning?: boolean
}

export interface EthereumProviderConfig {
  walletConnect?: WalletConnectParameters | boolean
  coinbase?: CoinbaseWalletParameters | boolean
  metaMask?: MetaMaskParameters | boolean
  baseAccount?: BaseAccountParameters | boolean
  porto?: Partial<PortoParameters> | boolean
  disableMessageSigning?: boolean
  sdkProvider?: SDKProvider | SDKProviderFactory<EthereumProviderDeps>
}
