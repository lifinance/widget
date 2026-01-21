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

export interface EthereumProviderConfig {
  walletConnect?: WalletConnectParameters | boolean
  coinbase?: CoinbaseWalletParameters | boolean
  metaMask?: MetaMaskParameters | boolean
  baseAccount?: BaseAccountParameters | boolean
  porto?: Partial<PortoParameters> | boolean
}
