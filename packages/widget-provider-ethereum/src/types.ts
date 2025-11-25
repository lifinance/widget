import type {
  BaseAccountParameters,
  CoinbaseWalletParameters,
  MetaMaskParameters,
  PortoParameters,
  WalletConnectParameters,
} from '@wagmi/connectors'
import type { CreateConnectorFn } from 'wagmi'

export interface CreateConnectorFnExtended extends CreateConnectorFn {
  id: string
  displayName: string
}

export interface EthereumProviderConfig {
  walletConnect?: WalletConnectParameters
  coinbase?: CoinbaseWalletParameters
  metaMask?: MetaMaskParameters
  baseAccount?: BaseAccountParameters
  porto?: Partial<PortoParameters>
}
