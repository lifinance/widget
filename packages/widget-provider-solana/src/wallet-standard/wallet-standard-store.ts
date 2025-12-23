import { create } from 'zustand'
import {
  WalletStandardClient,
  type WalletStandardClientConfig,
} from './wallet-standard-client.js'

export type SolanaWalletStandardState = ReturnType<
  WalletStandardClient['getState']
> & {
  select: (walletName: string) => Promise<void>
  disconnect: () => Promise<void>
  selectAccount: (address: string) => Promise<void>
}

// Global client singleton
export let walletStandardClient: WalletStandardClient | null = null

export function getOrCreateClient(
  config?: WalletStandardClientConfig
): WalletStandardClient {
  if (!walletStandardClient) {
    walletStandardClient = new WalletStandardClient(config)
  }
  return walletStandardClient
}

// Zustand store
export const walletStandardStore = create<SolanaWalletStandardState>((set) => {
  const client = getOrCreateClient()

  client.subscribe((newState) => {
    set(newState)
  })

  return {
    ...client.getState(),

    select: async (walletName: string) => {
      await client.select(walletName)
    },

    disconnect: async () => {
      await client.disconnect()
    },

    selectAccount: async (address: string) => {
      await client.selectAccount(address)
    },
  }
})
