import type { StoreApi, UseBoundStore } from 'zustand'

export interface StellarWalletIdentity {
  id: string
  name: string
  icon?: string
}

export interface StellarWalletInfo extends StellarWalletIdentity {
  /** Whether the wallet is installed / reachable in the current environment. */
  isAvailable: boolean
}

export interface StellarWalletsKitProps {
  networkPassphrase: string
  wallets: StellarWalletInfo[]
  selectedWalletId: string | null
  /**
   * Identity of the wallet the kit currently has selected. Resolved from the
   * kit's own module rather than from `wallets`, which is filled by an async
   * availability probe and is empty on the first render after a reload.
   */
  selectedWallet: StellarWalletIdentity | null
  address: string | null
  connected: boolean
  connecting: boolean
}

export interface StellarWalletsKitActions {
  connect: (walletId: string) => Promise<string | null>
  disconnect: () => Promise<void>
  refreshWallets: () => Promise<void>
  isWalletReachable: () => Promise<boolean>
}

export type StellarWalletsKitState = StellarWalletsKitProps &
  StellarWalletsKitActions

export type StellarWalletsKitStore = UseBoundStore<
  StoreApi<StellarWalletsKitState>
>
