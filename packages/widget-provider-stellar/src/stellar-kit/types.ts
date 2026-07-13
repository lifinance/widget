import type { StoreApi, UseBoundStore } from 'zustand'

export interface StellarWalletInfo {
  id: string
  name: string
  icon?: string
  /** Whether the wallet is installed / reachable in the current environment. */
  isAvailable: boolean
}

export interface StellarWalletsKitProps {
  networkPassphrase: string
  wallets: StellarWalletInfo[]
  selectedWalletId: string | null
  address: string | null
  connected: boolean
  connecting: boolean
}

export interface StellarWalletsKitActions {
  connect: (walletId: string) => Promise<string | null>
  disconnect: () => Promise<void>
  refreshWallets: () => Promise<void>
}

export type StellarWalletsKitState = StellarWalletsKitProps &
  StellarWalletsKitActions

export type StellarWalletsKitStore = UseBoundStore<
  StoreApi<StellarWalletsKitState>
>
