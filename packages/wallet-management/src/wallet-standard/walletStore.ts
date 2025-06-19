import type { UiWallet } from '@wallet-standard/react'
import { createStore } from 'zustand'
import type { WalletStoreState } from './types'

export type WalletStore = ReturnType<typeof createWalletStore>

export type WalletStoreConfig = {
  wallets: UiWallet[]
}

export const createWalletStore = ({ wallets }: WalletStoreConfig) =>
  createStore<WalletStoreState>()((set) => ({
    status: 'disconnected',
    wallets,
    currentAccount: null,
    currentWallet: null,
    selectWallet(wallet) {
      set(() => ({ currentWallet: wallet }))
    },
    selectAccount(account) {
      set(() => ({ currentAccount: account }))
    },
    setStatus(status) {
      set(() => ({ status }))
    },
  }))
