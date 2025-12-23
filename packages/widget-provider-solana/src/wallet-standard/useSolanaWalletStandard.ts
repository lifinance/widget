import {
  WalletStandardClient,
  type WalletStandardClientConfig,
} from './wallet-standard-client.js'
import {
  type SolanaWalletStandardState,
  walletStandardClient,
  walletStandardStore,
} from './wallet-standard-store.js'

export type { SolanaWalletStandardState }

// Hook that accepts optional config
export function useSolanaWalletStandard(
  config?: WalletStandardClientConfig
): SolanaWalletStandardState {
  // Initialize with config if provided and client doesn't exist yet
  if (config && !walletStandardClient) {
    const client = new WalletStandardClient(config)

    client.subscribe((newState) => {
      walletStandardStore.setState(newState)
    })

    walletStandardStore.setState(client.getState())
  }

  return walletStandardStore()
}
