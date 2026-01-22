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

  let onWalletRegisterUnsubscribe: (() => void) | null = null
  let onWalletUnregisterUnsubscribe: (() => void) | null = null
  let onWalletEventUnsubscribe: (() => void) | null = null

  const unsubscribeWalletEvents = () => {
    if (onWalletEventUnsubscribe) {
      onWalletEventUnsubscribe()
      onWalletEventUnsubscribe = null
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

    onWalletEventUnsubscribe = events.on('change', ({ accounts = [] }) => {
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

  const unsubscribeRegistryEvents = () => {
    if (onWalletRegisterUnsubscribe) {
      onWalletRegisterUnsubscribe()
      onWalletRegisterUnsubscribe = null
    }

    if (onWalletUnregisterUnsubscribe) {
      onWalletUnregisterUnsubscribe()
      onWalletUnregisterUnsubscribe = null
    }
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

        select: async (walletName, { silent = false } = {}) => {
          if (typeof window === 'undefined') {
            return
          }

          const wallet = get().wallets.find((w) => w.name === walletName)
          if (!wallet) {
            throw new Error(`Wallet ${walletName} not found`)
          }

          const walletConnect = (
            wallet.wallet.features['standard:connect'] as
              | StandardConnectFeature['standard:connect']
              | undefined
          )?.connect
          if (!walletConnect) {
            throw new Error(`Wallet ${walletName} does not support connect`)
          }

          set({ connecting: true })
          try {
            const result = await walletConnect({ silent })
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
          const walletDisconnect = (
            wallet?.features['standard:disconnect'] as
              | StandardDisconnectFeature['standard:disconnect']
              | undefined
          )?.disconnect

          if (walletDisconnect) {
            await walletDisconnect()
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
            const walletConnect = (
              selectedWallet.features['standard:connect'] as
                | StandardConnectFeature['standard:connect']
                | undefined
            )?.connect

            if (walletConnect) {
              const res = await walletConnect()
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
          unsubscribeRegistryEvents()
        },
      }),
      {
        name: storageKey,
        version: 0,
        partialize: (state) => ({
          selectedAccount: state.selectedAccount,
          selectedWallet: state.selectedWallet,
        }),
        onRehydrateStorage: () => {
          return (state, error) => {
            if (error || !state) {
              return
            }

            const persistedWalletName = state.selectedWallet?.name

            // Delay to allow wallet extensions time to inject and register
            if (typeof window !== 'undefined') {
              setTimeout(() => {
                const walletsApi = getWallets()
                const update = () => {
                  store.setState({ wallets: discoverSolanaWallets() })
                }

                update()
                // subscribe to wallet events
                onWalletRegisterUnsubscribe = walletsApi.on('register', update)
                onWalletUnregisterUnsubscribe = walletsApi.on(
                  'unregister',
                  update
                )

                // reconnect
                if (autoConnect && persistedWalletName) {
                  store.getState().select(persistedWalletName, { silent: true })
                }
              }, 100)
            }
          }
        },
      }
    )
  )

  return store
}
