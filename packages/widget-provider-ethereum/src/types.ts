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

export interface EVMWalletConfig {
  walletConnect?: WalletConnectParameters
  coinbase?: CoinbaseWalletParameters
  metaMask?: MetaMaskParameters
  baseAccount?: BaseAccountParameters
  porto?: Partial<PortoParameters>
}
