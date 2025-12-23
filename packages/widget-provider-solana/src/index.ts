// Hooks
export {
  type UseWalletAccountReturn,
  useWalletAccount,
} from './hooks/useWalletAccount'
export {
  type UseWalletSignerReturn,
  useWalletSigner,
} from './hooks/useWalletSigner'

// Widget Provider
export { SolanaProvider } from './providers/SolanaProvider.js'

// Wallet Standard Provider and Context
export type { SolanaWalletStandardState } from './providers/SolanaWalletStandardProvider.js'
export {
  SolanaWalletStandardProvider,
  useSolanaWalletStandard,
  useSolanaWalletStandardContext,
} from './providers/SolanaWalletStandardProvider.js'

// Wallet Standard Client
export type {
  AccountInfo,
  WalletInfo,
  WalletStandardClientConfig,
  WalletStandardClientState,
} from './wallet-standard-client.js'
export { WalletStandardClient } from './wallet-standard-client.js'
