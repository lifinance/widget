import type { Wallet, WalletAccount } from '@wallet-standard/base'
import type { StoreApi, UseBoundStore } from 'zustand'

export interface WalletInfo {
  wallet: Wallet
  name: string
  icon?: string
  installed: boolean
  connectable: boolean
}

export interface AccountInfo {
  address: string
  icon?: string
  raw: WalletAccount
}

export interface WalletStandardConfig {
  namePrefix?: string
  autoConnect?: boolean
}

export interface SolanaWalletStandardProps {
  wallets: WalletInfo[]
  selectedWallet: Wallet | null
  connected: boolean
  connecting: boolean
  accounts: AccountInfo[]
  selectedAccount: string | null
}

export interface SolanaWalletStandardActions {
  select: (walletName: string) => Promise<void>
  disconnect: () => Promise<void>
  selectAccount: (address: string) => Promise<void>
  destroy: () => void
}

export type SolanaWalletStandardState = SolanaWalletStandardProps &
  SolanaWalletStandardActions

export type WalletStandardStore = UseBoundStore<
  StoreApi<SolanaWalletStandardState>
>
