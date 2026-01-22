import { useShallow } from 'zustand/shallow'
import { createWalletStandardStore } from './createWalletStandardStore.js'
import type { SolanaWalletStandardState, WalletStandardStore } from './types.js'

export type { SolanaWalletStandardState }

const store: WalletStandardStore = createWalletStandardStore({
  autoConnect: true,
})

export function useSolanaWalletStandard(): SolanaWalletStandardState {
  return store(useShallow((state) => state))
}
