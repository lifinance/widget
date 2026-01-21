import { useShallow } from 'zustand/shallow'
import { createWalletStandardStore } from './createWalletStandardStore.js'
import type { SolanaWalletStandardState, WalletStandardStore } from './types.js'

export type { SolanaWalletStandardState }

let store: WalletStandardStore | null = null

export function useSolanaWalletStandard(): SolanaWalletStandardState {
  if (!store) {
    store = createWalletStandardStore()
  }

  return store(useShallow((state) => state))
}
