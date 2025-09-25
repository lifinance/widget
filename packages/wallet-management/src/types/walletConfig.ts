import type { Config as PortoConfig } from 'porto/Porto'
import type {
  BaseAccountParameters,
  CoinbaseWalletParameters,
  MetaMaskParameters,
  WalletConnectParameters,
} from 'wagmi/connectors'

export interface WalletConfig {
  walletConnect?: WalletConnectParameters
  coinbase?: CoinbaseWalletParameters
  metaMask?: MetaMaskParameters
  baseAccount?: BaseAccountParameters
  porto?: Partial<PortoConfig>
}
