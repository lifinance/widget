import { createWalletStandardStore } from './createWalletStandardStore.js'
import type {
  SolanaWalletStandardState,
  WalletStandardConfig,
} from './types.js'

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
