import type { UiWallet, UiWalletAccount } from '@wallet-standard/react'
export type WalletStoreStatus =
  | 'connected'
  | 'disconnected'
  | 'connecting'
  | 'reconnecting'

export interface WalletStoreState {
  currentAccount: UiWalletAccount | null
  wallets: UiWallet[]
  currentWallet: UiWallet | null
  status: WalletStoreStatus
  setStatus: (status: WalletStoreStatus) => void
  selectWallet: (wallet: UiWallet | null) => void
  selectAccount: (account: UiWalletAccount | null) => void
}
