import {
  activeAddress,
  KitEventType,
  Networks,
  StellarWalletsKit,
} from '@creit.tech/stellar-wallets-kit'
import { XBULL_ID } from '@creit.tech/stellar-wallets-kit/modules/xbull'
import { create } from 'zustand'
import {
  ENABLED_WALLET_IDS,
  initStellarWalletsKit,
} from './createStellarWalletsKit.js'
import type {
  StellarWalletIdentity,
  StellarWalletsKitState,
  StellarWalletsKitStore,
} from './types.js'

// SWK reports xBull as available via its web popup, so gate it to the extension global.
const isWalletInstalled = (id: string, reported: boolean): boolean => {
  if (id === XBULL_ID) {
    return (
      typeof window !== 'undefined' &&
      Boolean((window as { xBullSDK?: unknown }).xBullSDK)
    )
  }
  return reported
}

// SWK owns the selected module id and restores it itself.
const readSelectedWallet = (): StellarWalletIdentity | null => {
  try {
    const module = StellarWalletsKit.selectedModule
    if (!ENABLED_WALLET_IDS.includes(module.productId)) {
      return null
    }
    return {
      id: module.productId,
      name: module.productName,
      icon: module.productIcon,
    }
  } catch {
    return null
  }
}

const safeDisconnect = async (): Promise<void> => {
  try {
    await StellarWalletsKit.disconnect()
  } catch {
    // Non-WalletConnect wallets have no session to tear down.
  }
}

// Varial's availability check is a round trip to its MV3 service worker, which can be
// cold; freighter-api gives up after 2s, so wait a little longer than that.
const WALLET_REACHABLE_TIMEOUT_MS = 3000

// Best effort: only Varial, Klever and Bitget implement getNetwork.
const assertWalletNetwork = async (expected: string): Promise<void> => {
  let actual: string | undefined
  try {
    actual = (await StellarWalletsKit.getNetwork()).networkPassphrase
  } catch {
    return
  }
  if (actual && actual !== expected) {
    throw new Error(
      `The connected wallet is on the "${actual}" Stellar network, but the widget is configured for "${expected}". Switch the network in your wallet and connect again.`
    )
  }
}

// SWK's wallet modules read `window` when constructed, so the server gets an inert store.
const createServerStore = (): StellarWalletsKitStore =>
  create<StellarWalletsKitState>(() => ({
    networkPassphrase: Networks.PUBLIC,
    wallets: [],
    selectedWalletId: null,
    selectedWallet: null,
    address: null,
    connected: false,
    connecting: false,
    async connect() {
      return null
    },
    async disconnect() {},
    async refreshWallets() {},
    async isWalletReachable() {
      return false
    },
    async getWalletNetwork() {
      return Networks.PUBLIC
    },
  }))

export function createStellarWalletsKitStore(): StellarWalletsKitStore {
  if (typeof window === 'undefined') {
    return createServerStore()
  }

  const { networkPassphrase } = initStellarWalletsKit()

  let refreshing: Promise<void> | undefined
  let probeAgain = false
  // SWK reports a probe timeout as "not available", so a later miss must not hide a found wallet.
  const seenAvailable = new Set<string>()
  // While any connect runs, the kit's address is not trusted until the network check passes.
  // Only the active connect may settle the store, return an address or disconnect. An older
  // connect takes over when the active one is for the same wallet, or when none is active,
  // nothing is connected and no connect succeeded since it started; otherwise it rejects.
  let connectSeq = 0
  let activeConnect: number | undefined
  let settledConnect = 0
  let runningConnects = 0
  // The connect that started or took over last. While it runs, a click on its wallet joins it.
  let newestConnect:
    | { id: number; walletId: string; promise: Promise<string | null> }
    | undefined

  const activeConnectFor = (walletId: string) =>
    newestConnect !== undefined &&
    newestConnect.id === activeConnect &&
    newestConnect.walletId === walletId

  const store = create<StellarWalletsKitState>((set, get) => ({
    networkPassphrase,
    wallets: [],
    selectedWalletId: null,
    selectedWallet: null,
    address: null,
    connected: false,
    connecting: false,
    refreshWallets() {
      if (refreshing) {
        probeAgain = true
        return refreshing
      }
      const runProbes = async (): Promise<void> => {
        do {
          probeAgain = false
          const supported = await StellarWalletsKit.refreshSupportedWallets()
          const wallets = supported
            .filter((wallet) => ENABLED_WALLET_IDS.includes(wallet.id))
            .map((wallet) => {
              const isAvailable =
                seenAvailable.has(wallet.id) ||
                isWalletInstalled(wallet.id, wallet.isAvailable)
              if (isAvailable) {
                seenAvailable.add(wallet.id)
              }
              return {
                id: wallet.id,
                name: wallet.name,
                icon: wallet.icon,
                isAvailable,
              }
            })
          set({ wallets })
        } while (probeAgain)
      }
      refreshing = runProbes().finally(() => {
        refreshing = undefined
      })
      return refreshing
    },
    connect(walletId: string) {
      if (newestConnect !== undefined && activeConnectFor(walletId)) {
        return newestConnect.promise
      }
      const connectId = ++connectSeq
      activeConnect = connectId
      const assertLatest = () => {
        if (activeConnect !== connectId) {
          throw new Error('A newer wallet connection replaced this one.')
        }
      }
      runningConnects += 1
      const run = async (): Promise<string | null> => {
        set({ connecting: true })
        try {
          // A left connect may still hold its address in the kit; it must not pair with this wallet.
          activeAddress.value = undefined
          StellarWalletsKit.setWallet(walletId)
          const { address } = await StellarWalletsKit.fetchAddress()
          const takeOver =
            activeConnect === undefined
              ? !get().connected && connectId > settledConnect
              : activeConnect !== connectId && activeConnectFor(walletId)
          if (takeOver) {
            // The user still wants the wallet they approved.
            activeConnect = connectId
            newestConnect = { id: connectId, walletId, promise }
            StellarWalletsKit.setWallet(walletId)
          }
          assertLatest()
          await assertWalletNetwork(networkPassphrase)
          assertLatest()
          // An older connect can write its address while this one checks the network.
          activeAddress.value = address
          settledConnect = connectSeq
          set({ address, connected: Boolean(address), connecting: false })
          return address ?? null
        } catch (error) {
          if (activeConnect === connectId) {
            await safeDisconnect()
            set({ address: null, connected: false, connecting: false })
          } else {
            // SWK saves its address next to the selected wallet and restores the pair on
            // reload, so a connect that lost its turn must not leave its own address there.
            const { connected, address } = get()
            activeAddress.value =
              activeConnect === undefined && connected
                ? (address ?? undefined)
                : undefined
            // The user picked this wallet again, so that request decides the result.
            if (newestConnect !== undefined && activeConnectFor(walletId)) {
              return newestConnect.promise
            }
          }
          throw error
        } finally {
          runningConnects -= 1
          if (activeConnect === connectId) {
            activeConnect = undefined
          }
        }
      }
      const promise = run()
      newestConnect = { id: connectId, walletId, promise }
      return promise
    },
    async disconnect() {
      // SWK's `disconnect()` calls the active module's own `disconnect()`
      // without awaiting it, so a WalletConnect session teardown that rejects
      // asynchronously escapes upstream; this only catches what SWK surfaces.
      await safeDisconnect()
      set({ address: null, connected: false })
    },
    async getWalletNetwork() {
      try {
        // Klever and Bitget pass the extension's reply through untyped, so the
        // passphrase can be absent; that is unknown, not a mismatch.
        return (
          (await StellarWalletsKit.getNetwork()).networkPassphrase ??
          Networks.PUBLIC
        )
      } catch {
        // Five of the eight enabled modules have no getNetwork; treat them as compliant.
        return Networks.PUBLIC
      }
    },
    async isWalletReachable() {
      try {
        const module = StellarWalletsKit.selectedModule
        // An absent extension otherwise stalls every signing attempt.
        const timeout = new Promise<boolean>((resolve) =>
          setTimeout(() => resolve(false), WALLET_REACHABLE_TIMEOUT_MS)
        )
        const reported = await Promise.race([timeout, module.isAvailable()])
        return isWalletInstalled(module.productId, reported)
      } catch {
        return false
      }
    },
  }))

  // Keep the store's address in sync with the kit's internal state (also fires
  // on external disconnects and at launch, since SWK restores the address).
  // The store is a process-lifetime singleton, so these listeners live as long as the page.
  StellarWalletsKit.on(KitEventType.STATE_UPDATED, (event) => {
    if (runningConnects > 0) {
      return
    }
    // A restored address from a module we do not enable has no usable connector.
    const address =
      readSelectedWallet() !== null ? (event.payload.address ?? null) : null
    store.setState({ address, connected: Boolean(address) })
  })

  // Fires immediately with the module SWK restored from its own storage, then
  // on every selection change.
  StellarWalletsKit.on(KitEventType.WALLET_SELECTED, () => {
    const selectedWallet = readSelectedWallet()
    store.setState({
      selectedWallet,
      selectedWalletId: selectedWallet?.id ?? null,
    })
  })

  // Extension globals inject asynchronously and SWK's probe gives up after 1s, so a probe
  // issued during the first render can miss an installed wallet.
  const probeWallets = () => {
    store
      .getState()
      .refreshWallets()
      .catch((error) => {
        console.error('Failed to detect Stellar wallets:', error)
      })
  }

  probeWallets()

  const handleVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      probeWallets()
    }
  }

  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    if (document.readyState !== 'complete') {
      window.addEventListener('load', probeWallets, { once: true })
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
  }

  return store
}
