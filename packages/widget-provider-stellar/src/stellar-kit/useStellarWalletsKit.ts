import { useShallow } from 'zustand/shallow'
import type { StellarProviderConfig } from '../types.js'
import { createStellarWalletsKitStore } from './createStellarWalletsKitStore.js'
import type { StellarWalletsKitState, StellarWalletsKitStore } from './types.js'

export type { StellarWalletsKitState }

// Module-level singleton — the kit + connection state are shared across the app,
// mirroring the Solana wallet-standard store. The config from the first mount
// wins (it is stable for the lifetime of the app).
let store: StellarWalletsKitStore | undefined

export function getStellarWalletsKitStore(
  config?: StellarProviderConfig
): StellarWalletsKitStore {
  if (!store) {
    store = createStellarWalletsKitStore(config)
  }
  return store
}

export function useStellarWalletsKit(
  config?: StellarProviderConfig
): StellarWalletsKitState {
  return getStellarWalletsKitStore(config)(useShallow((state) => state))
}
