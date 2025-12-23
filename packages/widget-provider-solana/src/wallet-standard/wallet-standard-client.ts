// Adapted from https://github.com/solana-foundation/commerce-kit/blob/main/packages/connector/src/lib/connector-client.ts
import { getWallets } from '@wallet-standard/app'
import type {
  IdentifierArray,
  IdentifierRecord,
  Wallet,
  WalletAccount,
} from '@wallet-standard/base'
import type {
  StandardConnectFeature,
  StandardConnectOutput,
  StandardDisconnectFeature,
  StandardEventsChangeProperties,
  StandardEventsFeature,
} from '@wallet-standard/features'

export interface WalletInfo {
  wallet: Wallet
  name: string
  icon?: string
  installed: boolean
  /** Precomputed capability flag for UI convenience */
  connectable?: boolean
}

type WalletFeatureMap = IdentifierRecord<unknown>

export interface AccountInfo {
  address: string
  icon?: string
  raw: WalletAccount
}

export interface WalletStandardClientState {
  wallets: WalletInfo[]
  selectedWallet: Wallet | null
  connected: boolean
  connecting: boolean
  accounts: AccountInfo[]
  selectedAccount: string | null
}

type Listener = (s: WalletStandardClientState) => void

export interface WalletStandardClientConfig {
  autoConnect?: boolean
  debug?: boolean
  /** Account polling interval in milliseconds when wallet events are not available (default: 1500) */
  accountPollingIntervalMs?: number
  storage?: {
    getItem: (k: string) => string | null
    setItem: (k: string, v: string) => void
    removeItem: (k: string) => void
  }
}

const STORAGE_KEY = 'wallet-connector:lastWallet'
const DEFAULT_ACCOUNT_POLLING_INTERVAL_MS = 1500

const INITIAL_STATE: WalletStandardClientState = {
  wallets: [],
  selectedWallet: null,
  connected: false,
  connecting: false,
  accounts: [],
  selectedAccount: null,
}

export class WalletStandardClient {
  private state: WalletStandardClientState
  private listeners = new Set<Listener>()
  private unsubscribers: Array<() => void> = []
  private walletChangeUnsub: (() => void) | null = null
  private pollTimer: ReturnType<typeof setInterval> | null = null

  constructor(private config: WalletStandardClientConfig = {}) {
    this.state = { ...INITIAL_STATE }
    this.initialize()
  }

  private getStorage(): WalletStandardClientConfig['storage'] {
    if (this.config.storage) {
      return this.config.storage
    }
    if (typeof window !== 'undefined') {
      try {
        // Accessing window.localStorage can throw in sandboxed iframes
        if (window.localStorage) {
          return {
            getItem: (k: string) => window.localStorage.getItem(k),
            setItem: (k: string, v: string) =>
              window.localStorage.setItem(k, v),
            removeItem: (k: string) => window.localStorage.removeItem(k),
          }
        }
      } catch {
        // Ignore storage when not available
        return undefined
      }
    }
    return undefined
  }

  private updateWallets(wallets: readonly Wallet[]) {
    const unique = Array.from(new Set(wallets.map((w) => w.name)))
      .map((n) => wallets.find((w) => w.name === n))
      .filter((w): w is Wallet => w !== undefined)

    this.state = {
      ...this.state,
      wallets: unique.map((walletEntry) => {
        const features = walletEntry.features as WalletFeatureMap
        const hasConnect = Boolean(features['standard:connect'])
        const hasDisconnect = Boolean(features['standard:disconnect'])
        const chains = walletEntry.chains as IdentifierArray | undefined
        const isSolana =
          Array.isArray(chains) &&
          chains.some(
            (chain) => typeof chain === 'string' && chain.includes('solana')
          )
        const connectable = Boolean(hasConnect && hasDisconnect && isSolana)
        return {
          wallet: walletEntry,
          name: walletEntry.name,
          icon: walletEntry.icon,
          installed: true,
          connectable,
        } satisfies WalletInfo
      }),
    }
    this.notify()
  }

  private getSolanaWallets() {
    const walletsApi = getWallets()
    const wallets = walletsApi.get()
    const solanaWallets = wallets.filter((w) => {
      const isSolana =
        Array.isArray(w.chains) &&
        w.chains.some(
          (chain) => typeof chain === 'string' && chain.includes('solana')
        )
      return isSolana
    })
    return solanaWallets
  }

  private initialize() {
    if (typeof window === 'undefined') {
      return
    }

    const update = () => {
      const wallets = this.getSolanaWallets()
      return this.updateWallets(wallets)
    }
    update()
    const walletsApi = getWallets()
    this.unsubscribers.push(walletsApi.on('register', update))
    this.unsubscribers.push(walletsApi.on('unregister', update))
    if (this.config.autoConnect) {
      setTimeout(() => this.attemptAutoConnect(), 100)
    }
  }

  private async attemptAutoConnect() {
    try {
      const storage = this.getStorage()
      let last: string | null = null

      // Safely get last wallet from storage
      try {
        last = storage?.getItem(STORAGE_KEY) ?? null
      } catch (error) {
        if (this.config.debug) {
          console.warn('[Connector] Failed to read wallet preference:', error)
        }
        return
      }

      if (!last) {
        return
      }
      if (this.state.wallets.some((w) => w.name === last)) {
        await this.select(last)
      }
    } catch {
      // If auto-connect fails, try to clean up the stored preference
      try {
        this.getStorage()?.removeItem(STORAGE_KEY)
      } catch (error) {
        if (this.config.debug) {
          console.warn(
            '[Connector] Failed to remove invalid wallet preference:',
            error
          )
        }
      }
    }
  }

  subscribe(listener: Listener) {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  getState(): WalletStandardClientState {
    return this.state
  }

  private notify() {
    for (const listener of this.listeners) {
      listener(this.state)
    }
  }

  private startPollingWalletAccounts() {
    if (this.pollTimer) {
      return
    }
    const wallet = this.state.selectedWallet
    if (!wallet) {
      return
    }
    this.pollTimer = setInterval(() => {
      try {
        const walletAccounts = (wallet.accounts ??
          []) as readonly WalletAccount[]
        const accountMap = new Map<string, WalletAccount>()
        for (const account of walletAccounts) {
          accountMap.set(account.address, account)
        }
        const nextAccounts: AccountInfo[] = Array.from(accountMap.values()).map(
          (account): AccountInfo => ({
            address: account.address,
            icon: account.icon,
            raw: account,
          })
        )
        const selectedStillExists =
          this.state.selectedAccount &&
          nextAccounts.some((acc) => acc.address === this.state.selectedAccount)
        const newSelected = selectedStillExists
          ? this.state.selectedAccount
          : (nextAccounts[0]?.address ?? null)
        // Only update if changed
        const changed =
          nextAccounts.length !== this.state.accounts.length ||
          nextAccounts.some(
            (acc, i) => acc.address !== this.state.accounts[i]?.address
          )
        if (changed) {
          this.state = {
            ...this.state,
            accounts: nextAccounts,
            selectedAccount: newSelected,
          }
          this.notify()
        }
      } catch (error) {
        if (this.config.debug) {
          console.warn('[Connector] Error during account polling:', error)
        }
      }
    }, this.config.accountPollingIntervalMs ??
      DEFAULT_ACCOUNT_POLLING_INTERVAL_MS)
  }

  private stopPollingWalletAccounts() {
    if (this.pollTimer) {
      clearInterval(this.pollTimer)
      this.pollTimer = null
    }
  }

  private unsubscribeWalletEvents() {
    if (this.walletChangeUnsub) {
      try {
        this.walletChangeUnsub()
      } catch (error) {
        if (this.config.debug) {
          console.warn('[Connector] Error unsubscribing wallet events:', error)
        }
      }
      this.walletChangeUnsub = null
    }
  }

  private subscribeToWalletEvents() {
    this.unsubscribeWalletEvents()
    this.stopPollingWalletAccounts()

    const wallet = this.state.selectedWallet
    if (!wallet) {
      return
    }

    // Check if wallet supports standard:events feature
    const eventsFeature = wallet.features['standard:events']
    if (!eventsFeature) {
      // Fallback: start polling wallet.accounts when events are not available
      this.startPollingWalletAccounts()
      return
    }

    try {
      // Subscribe to change events
      const onEvents = (
        eventsFeature as StandardEventsFeature['standard:events']
      ).on
      this.walletChangeUnsub = onEvents(
        'change',
        (properties: StandardEventsChangeProperties) => {
          // Aggregate accounts from event and wallet.accounts (some wallets only include selected account in the event)
          const changeAccounts = (properties.accounts ??
            []) as readonly WalletAccount[]
          const walletAccounts = (wallet.accounts ??
            []) as readonly WalletAccount[]
          const accountMap = new Map<string, WalletAccount>()
          for (const account of [...walletAccounts, ...changeAccounts]) {
            accountMap.set(account.address, account)
          }
          const nextAccounts: AccountInfo[] = Array.from(
            accountMap.values()
          ).map(
            (account): AccountInfo => ({
              address: account.address,
              icon: account.icon,
              raw: account,
            })
          )

          // Preserve selection if possible
          const selectedStillExists =
            this.state.selectedAccount &&
            nextAccounts.some(
              (acc) => acc.address === this.state.selectedAccount
            )
          const newSelected = selectedStillExists
            ? this.state.selectedAccount
            : (nextAccounts[0]?.address ?? null)

          this.state = {
            ...this.state,
            accounts: nextAccounts,
            selectedAccount: newSelected,
          }
          this.notify()
        }
      )
    } catch (error) {
      if (this.config.debug) {
        console.warn('[Connector] Failed to subscribe to wallet events:', error)
      }
      // Fallback to polling when event subscription fails
      this.startPollingWalletAccounts()
    }
  }

  async select(walletName: string): Promise<void> {
    if (typeof window === 'undefined') {
      return
    }
    const w = this.state.wallets.find((x) => x.name === walletName)
    if (!w) {
      throw new Error(`Wallet ${walletName} not found`)
    }
    this.state = { ...this.state, connecting: true }
    this.notify()
    try {
      const connectFeature = w.wallet.features['standard:connect']
      if (!connectFeature) {
        throw new Error(
          `Wallet ${walletName} does not support standard connect`
        )
      }
      const connect = (
        connectFeature as StandardConnectFeature['standard:connect']
      ).connect
      const result: StandardConnectOutput = await connect({ silent: false })
      const walletAccounts = (w.wallet.accounts ??
        []) as readonly WalletAccount[]
      const accountMap = new Map<string, WalletAccount>()
      for (const account of [...walletAccounts, ...result.accounts]) {
        accountMap.set(account.address, account)
      }
      const accounts: AccountInfo[] = Array.from(accountMap.values()).map(
        (account): AccountInfo => ({
          address: account.address,
          icon: account.icon,
          raw: account,
        })
      )
      // Prefer a never-before-seen account when reconnecting; otherwise preserve selection
      const previouslySelected = this.state.selectedAccount
      const previousAddresses = new Set(
        this.state.accounts.map((a) => a.address)
      )
      const firstNew = accounts.find((a) => !previousAddresses.has(a.address))
      const selected =
        firstNew?.address ?? previouslySelected ?? accounts[0]?.address ?? null

      this.state = {
        ...this.state,
        selectedWallet: w.wallet,
        connected: true,
        connecting: false,
        accounts,
        selectedAccount: selected,
      }

      // Store wallet preference, but don't fail connection if storage fails
      try {
        this.getStorage()?.setItem(STORAGE_KEY, walletName)
      } catch (error) {
        if (this.config.debug) {
          console.warn('[Connector] Failed to store wallet preference:', error)
        }
      }
      // Subscribe to wallet change events (or start polling if unavailable)
      this.subscribeToWalletEvents()
      this.notify()
    } catch (e) {
      this.state = {
        ...this.state,
        ...INITIAL_STATE,
        wallets: this.state.wallets, // Preserve discovered wallets
      }
      this.notify()
      throw e
    }
  }

  async disconnect(): Promise<void> {
    // Cleanup wallet event listener
    this.unsubscribeWalletEvents()
    this.stopPollingWalletAccounts()

    // Call wallet's disconnect feature if available
    const wallet = this.state.selectedWallet
    if (wallet) {
      const disconnectFeature = wallet.features['standard:disconnect']
      if (disconnectFeature) {
        try {
          await (
            disconnectFeature as StandardDisconnectFeature['standard:disconnect']
          ).disconnect()
        } catch (error) {
          if (this.config.debug) {
            console.warn('[Connector] Wallet disconnect failed:', error)
          }
        }
      }
    }

    this.state = {
      ...this.state,
      selectedWallet: null,
      connected: false,
      accounts: [],
      selectedAccount: null,
    }

    // Remove wallet preference, but don't fail disconnect if storage fails
    try {
      this.getStorage()?.removeItem(STORAGE_KEY)
    } catch (error) {
      if (this.config.debug) {
        console.warn('[Connector] Failed to remove wallet preference:', error)
      }
    }

    this.notify()
  }

  async selectAccount(address: string): Promise<void> {
    const current = this.state.selectedWallet
    if (!current) {
      throw new Error('No wallet connected')
    }
    let target =
      this.state.accounts.find((acc: AccountInfo) => acc.address === address)
        ?.raw ?? null
    if (!target) {
      try {
        const feature = current.features['standard:connect']
        if (feature) {
          const connect = (
            feature as StandardConnectFeature['standard:connect']
          ).connect
          const res = await connect()
          const accounts: AccountInfo[] = res.accounts.map(
            (a: WalletAccount) => ({
              address: a.address,
              icon: a.icon,
              raw: a,
            })
          )
          target =
            accounts.find((acc: AccountInfo) => acc.address === address)?.raw ??
            res.accounts[0] ??
            null
          this.state = { ...this.state, accounts }
        }
      } catch (error) {
        if (this.config.debug) {
          console.warn(
            '[Connector] Failed to reconnect for account selection:',
            error
          )
        }
        throw new Error('Failed to reconnect wallet for account selection')
      }
    }
    if (!target) {
      throw new Error('Requested account not available')
    }
    this.state = { ...this.state, selectedAccount: target.address as string }
    this.notify()
  }

  // Cleanup any resources (event listeners, timers) created by this client
  destroy(): void {
    // Unsubscribe wallet change listener
    this.unsubscribeWalletEvents()
    // Stop any polling timers
    this.stopPollingWalletAccounts()
    // Unsubscribe from wallets API events
    for (const unsubscribe of this.unsubscribers) {
      try {
        unsubscribe()
      } catch {}
    }
    this.unsubscribers = []
    // Clear external store listeners
    this.listeners.clear()
  }
}
