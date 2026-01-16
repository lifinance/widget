import { getWallets } from '@wallet-standard/app'
import type { Wallet, WalletAccount } from '@wallet-standard/base'
import type {
  StandardConnectFeature,
  StandardDisconnectFeature,
  StandardEventsFeature,
} from '@wallet-standard/features'
import { create, type StoreApi } from 'zustand'

// ─── Types ───────────────────────────────────────────────────────────────────

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

interface Storage {
  getItem: (k: string) => string | null
  setItem: (k: string, v: string) => void
  removeItem: (k: string) => void
}

export interface WalletStandardConfig {
  autoConnect?: boolean
  debug?: boolean
  storage?: Storage
  storageKey?: string
}

export interface SolanaWalletStandardState {
  wallets: WalletInfo[]
  selectedWallet: Wallet | null
  connected: boolean
  connecting: boolean
  accounts: AccountInfo[]
  selectedAccount: string | null
  select: (walletName: string) => Promise<void>
  disconnect: () => Promise<void>
  selectAccount: (address: string) => Promise<void>
  destroy: () => void
}

// ─── Constants ───────────────────────────────────────────────────────────────

const DEFAULT_STORAGE_KEY = 'li.fi-widget-solana-wallets'

// ─── Helpers ─────────────────────────────────────────────────────────────────

const isSolanaWallet = (wallet: Wallet): boolean =>
  wallet.chains?.some((c) => c.includes('solana')) ?? false

const hasFeature = (wallet: Wallet, feature: string): boolean =>
  feature in wallet.features

const toAccountInfo = (account: WalletAccount): AccountInfo => ({
  address: account.address,
  icon: account.icon,
  raw: account,
})

const mergeAccounts = (
  ...sources: (readonly WalletAccount[])[]
): AccountInfo[] => {
  const map = new Map<string, WalletAccount>()
  for (const account of sources.flat()) {
    map.set(account.address, account)
  }
  return Array.from(map.values()).map(toAccountInfo)
}

const toWalletInfo = (wallet: Wallet): WalletInfo => ({
  wallet,
  name: wallet.name,
  icon: wallet.icon,
  installed: true,
  connectable:
    isSolanaWallet(wallet) &&
    hasFeature(wallet, 'standard:connect') &&
    hasFeature(wallet, 'standard:disconnect'),
})

const getDefaultStorage = (): Storage | undefined => {
  if (typeof window === 'undefined') {
    return undefined
  }
  try {
    return window.localStorage ?? undefined
  } catch {
    return undefined
  }
}

const discoverSolanaWallets = (): WalletInfo[] => {
  if (typeof window === 'undefined') {
    return []
  }
  const seen = new Set<string>()
  return getWallets()
    .get()
    .filter((w) => isSolanaWallet(w) && !seen.has(w.name) && seen.add(w.name))
    .map(toWalletInfo)
}

// ─── Store Factory ───────────────────────────────────────────────────────────

export const createWalletStandardStore = (
  config: WalletStandardConfig = {}
) => {
  const storage = config.storage ?? getDefaultStorage()
  const storageKey = config.storageKey ?? DEFAULT_STORAGE_KEY
  const debug = (msg: string, err?: unknown) => {
    if (config.debug) {
      console.warn(`[Connector] ${msg}`, err)
    }
  }

  // Instance-scoped cleanup refs
  let unsubscribers: (() => void)[] = []
  let walletEventUnsub: (() => void) | null = null

  const unsubscribeWalletEvents = () => {
    if (walletEventUnsub) {
      try {
        walletEventUnsub()
      } catch (e) {
        debug('Error unsubscribing', e)
      }
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

    try {
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
    } catch (e) {
      debug('Failed to subscribe to wallet events', e)
    }
  }

  const store = create<SolanaWalletStandardState>((set, get, api) => ({
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

        try {
          storage?.setItem(storageKey, walletName)
        } catch (e) {
          debug('Failed to store preference', e)
        }

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
        try {
          await disconnectFn()
        } catch (e) {
          debug('Disconnect failed', e)
        }
      }

      set({
        selectedWallet: null,
        connected: false,
        accounts: [],
        selectedAccount: null,
      })

      try {
        storage?.removeItem(storageKey)
      } catch (e) {
        debug('Failed to remove preference', e)
      }
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
          try {
            const res = await connectFn()
            const refreshed = res.accounts.map(toAccountInfo)
            set({ accounts: refreshed })
            target = refreshed.find((a) => a.address === address)
          } catch (e) {
            debug('Failed to reconnect for account selection', e)
            throw new Error('Failed to reconnect wallet')
          }
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
  }))

  // Set up wallet discovery listeners
  if (typeof window !== 'undefined') {
    const update = () => store.setState({ wallets: discoverSolanaWallets() })
    const walletsApi = getWallets()
    unsubscribers.push(walletsApi.on('register', update))
    unsubscribers.push(walletsApi.on('unregister', update))

    if (config.autoConnect) {
      setTimeout(async () => {
        const last = storage?.getItem(storageKey)
        if (last && store.getState().wallets.some((w) => w.name === last)) {
          try {
            await store.getState().select(last)
          } catch {
            try {
              storage?.removeItem(storageKey)
            } catch {}
          }
        }
      }, 100)
    }
  }

  return store
}
