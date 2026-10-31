import type { SDKProvider } from '@lifi/sdk'
import type { SDKProviderFactory } from '@lifi/widget-provider'
import type { Client } from 'viem'
import type { CreateConnectorFn } from 'wagmi'
import type {
  BaseAccountParameters,
  CoinbaseWalletParameters,
  MetaMaskParameters,
  WalletConnectParameters,
} from 'wagmi/connectors'

export interface CreateConnectorFnExtended extends CreateConnectorFn {
  id: string
  displayName: string
  icon?: string
}

export interface EthereumProviderDeps {
  getWalletClient: () => Promise<Client>
  switchChain: (chainId: number) => Promise<Client | undefined>
  disableMessageSigning?: boolean
}

export interface EthereumProviderConfig {
  /** Opt in to a named Oath iOS wallet entry with direct WalletConnect pairing. */
  oathWallet?: WalletConnectParameters | boolean
  walletConnect?: WalletConnectParameters | boolean
  coinbase?: CoinbaseWalletParameters | boolean
  metaMask?: MetaMaskParameters | boolean
  baseAccount?: BaseAccountParameters | boolean
  disableMessageSigning?: boolean
  sdkProvider?: SDKProvider | SDKProviderFactory<EthereumProviderDeps>
}
