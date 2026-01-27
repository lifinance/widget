import { getWallets } from '@wallet-standard/app'
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
import { getSolanaWallets, mergeAccounts, toAccountInfo } from './utils.js'

export const createWalletStandardStore = ({
  namePrefix,
  autoConnect,
}: WalletStandardConfig = {}) => {
  const storageKey = `${namePrefix || 'li.fi'}-solana-wallets`

  let onWalletEventUnsubscribe: (() => void) | null = null
  let onRegisterUnsubscribe: (() => void) | null = null
  let onUnregisterUnsubscribe: (() => void) | null = null

  const unsubscribeWalletEvents = () => {
    if (onWalletEventUnsubscribe) {
      onWalletEventUnsubscribe()
      onWalletEventUnsubscribe = null
    }
  }

  const unsubscribeRegistryEvents = () => {
    onRegisterUnsubscribe?.()
    onUnregisterUnsubscribe?.()
    onRegisterUnsubscribe = null
    onUnregisterUnsubscribe = null
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
      if (accounts.length === 0) {
        store.setState({
          connected: false,
          accounts: [],
          selectedAccount: null,
        })
        return
      }

      const { connect, selectedWalletName } = store.getState()
      if (selectedWalletName) {
        connect(selectedWalletName, {
          preferredAccount: accounts[0]?.address,
          silent: true,
        })
      }
    })
  }

  const subscribeToRegistryEvents = (
    store: StoreApi<SolanaWalletStandardState>
  ) => {
    if (typeof window === 'undefined') {
      return
    }

    const { on } = getWallets()

    onRegisterUnsubscribe = on('register', () => {
      store.setState({ wallets: getSolanaWallets() })
    })

    onUnregisterUnsubscribe = on('unregister', () => {
      const wallets = getSolanaWallets()
      const { selectedWalletName, disconnect } = store.getState()

      if (
        selectedWalletName &&
        !wallets.some((w) => w.name === selectedWalletName)
      ) {
        disconnect()
      }

      store.setState({ wallets })
    })
  }

  const store = create<SolanaWalletStandardState>()(
    persist(
      (set, get, api) => ({
        wallets: getSolanaWallets(),
        selectedWallet: null,
        // Persisted separately as some wallet objects contain non-serializable properties
        selectedWalletName: null,
        connected: false,
        connecting: false,
        accounts: [],
        selectedAccount: null,

        connect: async (
          walletName,
          { silent = false, preferredAccount } = {}
        ) => {
          if (typeof window === 'undefined') {
            return null
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
            const targetAccount = preferredAccount ?? get().selectedAccount
            const targetExists = accounts.some(
              (a) => a.address === targetAccount
            )

            const resolvedAccount = targetExists
              ? targetAccount
              : (accounts[0]?.address ?? null)

            set({
              selectedWallet: wallet.wallet,
              selectedWalletName: wallet.name,
              connected: true,
              connecting: false,
              accounts,
              selectedAccount: resolvedAccount,
            })

            subscribeToWalletEvents(api)

            return resolvedAccount
          } catch (e) {
            set({
              selectedWallet: null,
              selectedWalletName: null,
              connected: false,
              connecting: false,
              accounts: [],
              selectedAccount: null,
            })
            if (!silent) {
              throw e
            }
            return null
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
            selectedWalletName: null,
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
          selectedWalletName: state.selectedWalletName,
        }),

        onRehydrateStorage: () => {
          return async (state, error) => {
            if (error || !state || !autoConnect) {
              return
            }

            const {
              selectedAccount: persistedAccount,
              selectedWalletName: persistedWalletName,
            } = state

            if (!persistedWalletName) {
              return
            }

            const wallets = getSolanaWallets()
            const targetWallet = wallets.find(
              (w) => w.name === persistedWalletName
            )

            if (targetWallet && !state.connected) {
              await state.connect(persistedWalletName, {
                silent: true,
                preferredAccount: persistedAccount ?? undefined,
              })
            }
          }
        },
      }
    )
  )

  subscribeToRegistryEvents(store)

  return store
}
