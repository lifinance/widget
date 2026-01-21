import { getWallets } from '@wallet-standard/app'
import type { WalletAccount } from '@wallet-standard/base'
import type {
  StandardConnectFeature,
  StandardDisconnectFeature,
  StandardEventsFeature,
} from '@wallet-standard/features'
import { create, type StoreApi } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  SolanaWalletStandardState,
  WalletStandardConfig,
} from './types.js'
import { discoverSolanaWallets, mergeAccounts, toAccountInfo } from './utils.js'

export const createWalletStandardStore = ({
  namePrefix,
  autoConnect,
}: WalletStandardConfig = {}) => {
  const storageKey = `${namePrefix || 'li.fi'}-solana-wallets`

  let unsubscribers: (() => void)[] = []
  let walletEventUnsub: (() => void) | null = null

  const unsubscribeWalletEvents = () => {
    if (walletEventUnsub) {
      walletEventUnsub()
      walletEventUnsub = null
    }
  }

  const subscribeToWalletEvents = (
    store: StoreApi<SolanaWalletStandardState>
  ) => {
    unsubscribeWalletEvents()
    const wallet = store.getState().selectedWallet
    if (!wallet) {
      return
    }

    const events = wallet.features['standard:events'] as
      | StandardEventsFeature['standard:events']
      | undefined
    if (!events) {
      return
    }

    walletEventUnsub = events.on('change', ({ accounts = [] }) => {
      const { selectedAccount } = store.getState()
      const nextAccounts = mergeAccounts(
        wallet.accounts ?? [],
        accounts as WalletAccount[]
      )
      const stillExists = nextAccounts.some(
        (a) => a.address === selectedAccount
      )
      store.setState({
        accounts: nextAccounts,
        selectedAccount: stillExists
          ? selectedAccount
          : (nextAccounts[0]?.address ?? null),
      })
    })
  }

  const store = create<SolanaWalletStandardState>()(
    persist(
      (set, get, api) => ({
        wallets: discoverSolanaWallets(),
        selectedWallet: null,
        connected: false,
        connecting: false,
        accounts: [],
        selectedAccount: null,

        select: async (walletName) => {
          if (typeof window === 'undefined') {
            return
          }

          const wallet = get().wallets.find((w) => w.name === walletName)
          if (!wallet) {
            throw new Error(`Wallet ${walletName} not found`)
          }

          const connectFn = (
            wallet.wallet.features['standard:connect'] as
              | StandardConnectFeature['standard:connect']
              | undefined
          )?.connect
          if (!connectFn) {
            throw new Error(`Wallet ${walletName} does not support connect`)
          }

          set({ connecting: true })
          try {
            const result = await connectFn({ silent: false })
            const accounts = mergeAccounts(
              wallet.wallet.accounts ?? [],
              result.accounts
            )
            const previousAddrs = new Set(get().accounts.map((a) => a.address))
            const firstNew = accounts.find((a) => !previousAddrs.has(a.address))

            set({
              selectedWallet: wallet.wallet,
              connected: true,
              connecting: false,
              accounts,
              selectedAccount:
                firstNew?.address ??
                get().selectedAccount ??
                accounts[0]?.address ??
                null,
            })

            subscribeToWalletEvents(api)
          } catch (e) {
            set({
              selectedWallet: null,
              connected: false,
              connecting: false,
              accounts: [],
              selectedAccount: null,
            })
            throw e
          }
        },

        disconnect: async () => {
          unsubscribeWalletEvents()
          const wallet = get().selectedWallet
          const disconnectFn = (
            wallet?.features['standard:disconnect'] as
              | StandardDisconnectFeature['standard:disconnect']
              | undefined
          )?.disconnect

          if (disconnectFn) {
            await disconnectFn()
          }

          set({
            selectedWallet: null,
            connected: false,
            accounts: [],
            selectedAccount: null,
          })
        },

        selectAccount: async (address) => {
          const { selectedWallet, accounts } = get()
          if (!selectedWallet) {
            throw new Error('No wallet connected')
          }

          let target = accounts.find((a) => a.address === address)
          if (!target) {
            const connectFn = (
              selectedWallet.features['standard:connect'] as
                | StandardConnectFeature['standard:connect']
                | undefined
            )?.connect

            if (connectFn) {
              const res = await connectFn()
              const refreshed = res.accounts.map(toAccountInfo)
              set({ accounts: refreshed })
              target = refreshed.find((a) => a.address === address)
            }
          }

          if (!target) {
            throw new Error('Account not available')
          }

          set({ selectedAccount: target.address })
        },

        destroy: () => {
          unsubscribeWalletEvents()
          for (const fn of unsubscribers) {
            try {
              fn()
            } catch {}
          }
          unsubscribers = []
        },
      }),
      {
        name: storageKey,
        version: 0,
        partialize: (state) => ({
          selectedAccount: state.selectedAccount,
        }),
        onRehydrateStorage: () => {
          return (state, error) => {
            if (error || !state) {
              return
            }

            if (autoConnect && state.selectedAccount) {
              const wallets = discoverSolanaWallets()
              state.wallets = wallets
            }

            // Subscribe to wallet registration events
            if (typeof window !== 'undefined') {
              const walletsApi = getWallets()
              const update = () => {
                store.setState({ wallets: discoverSolanaWallets() })
              }
              unsubscribers.push(walletsApi.on('register', update))
              unsubscribers.push(walletsApi.on('unregister', update))
            }
          }
        },
      }
    )
  )

  return store
}
