import type {
  CoinbaseWalletParameters,
  MetaMaskParameters,
  WalletConnectParameters,
} from '@wagmi/connectors';

export interface WalletConfig {
  walletConnect?: WalletConnectParameters;
  coinbase?: CoinbaseWalletParameters;
  metaMask?: MetaMaskParameters;
}
