import { useShallow } from 'zustand/shallow'
import { createStellarWalletsKitStore } from './createStellarWalletsKitStore.js'
import type { StellarWalletsKitState, StellarWalletsKitStore } from './types.js'

export type { StellarWalletsKitState }

// Module-level singleton — the kit + connection state are shared across the app,
// mirroring the Solana wallet-standard store.
let store: StellarWalletsKitStore | undefined

export function getStellarWalletsKitStore(): StellarWalletsKitStore {
  if (!store) {
    store = createStellarWalletsKitStore()
  }
  return store
}

export function useStellarWalletsKit(): StellarWalletsKitState {
  return getStellarWalletsKitStore()(useShallow((state) => state))
}
