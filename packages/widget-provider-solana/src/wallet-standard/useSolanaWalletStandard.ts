import {
  createWalletStandardStore,
  type SolanaWalletStandardState,
  type WalletStandardConfig,
} from './wallet-standard-store.js'

export type { SolanaWalletStandardState }

let store: ReturnType<typeof createWalletStandardStore> | null = null

function getStore(config?: WalletStandardConfig) {
  if (!store) {
    store = createWalletStandardStore(config)
  }
  return store
}

export function useSolanaWalletStandard(
  config?: WalletStandardConfig
): SolanaWalletStandardState {
  return getStore(config)()
}
