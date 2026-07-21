import {
  KitEventType,
  StellarWalletsKit,
} from '@creit.tech/stellar-wallets-kit'
import { create } from 'zustand'
import type { StellarProviderConfig } from '../types.js'
import {
  ENABLED_WALLET_IDS,
  initStellarWalletsKit,
} from './createStellarWalletsKit.js'
import type { StellarWalletsKitState, StellarWalletsKitStore } from './types.js'

const STORAGE_KEY = 'li.fi-stellar-wallet'

const XBULL_ID = 'xbull'

/**
 * SWK reports xBull as always-available because it can fall back to a web popup,
 * so we gate it to the actual browser-extension global (`window.xBullSDK`) to
 * keep the "installed only" behavior. Every other wallet uses SWK's own
 * availability: extension wallets (Freighter/Rabet/Hana/Lobstr) report true only
 * when installed, and WalletConnect reports true as an always-offered QR method.
 */
const isWalletInstalled = (id: string, reported: boolean): boolean => {
  if (id === XBULL_ID) {
    return (
      typeof window !== 'undefined' &&
      Boolean((window as { xBullSDK?: unknown }).xBullSDK)
    )
  }
  return reported
}

export function createStellarWalletsKitStore(
  config?: StellarProviderConfig
): StellarWalletsKitStore {
  const { networkPassphrase } = initStellarWalletsKit(config)

  const store = create<StellarWalletsKitState>((set) => ({
    networkPassphrase,
    wallets: [],
    selectedWalletId: null,
    address: null,
    connected: false,
    connecting: false,
    async refreshWallets() {
      const supported = await StellarWalletsKit.refreshSupportedWallets()
      const wallets = supported
        .filter((wallet) => ENABLED_WALLET_IDS.includes(wallet.id))
        .map((wallet) => ({
          id: wallet.id,
          name: wallet.name,
          icon: wallet.icon,
          isAvailable: isWalletInstalled(wallet.id, wallet.isAvailable),
        }))
      set({ wallets })
    },
    async connect(walletId: string) {
      set({ connecting: true })
      try {
        StellarWalletsKit.setWallet(walletId)
        const { address } = await StellarWalletsKit.fetchAddress()
        set({
          selectedWalletId: walletId,
          address,
          connected: Boolean(address),
          connecting: false,
        })
        if (typeof window !== 'undefined' && address) {
          window.localStorage.setItem(STORAGE_KEY, walletId)
        }
        return address ?? null
      } catch (error) {
        set({ connecting: false })
        throw error
      }
    },
    async disconnect() {
      try {
        await StellarWalletsKit.disconnect()
      } catch {
        // Non-WalletConnect wallets have no session to tear down.
      }
      set({ selectedWalletId: null, address: null, connected: false })
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(STORAGE_KEY)
      }
    },
  }))

  // Keep the store's address in sync with the kit's internal state (also fires
  // on external disconnects and at launch).
  StellarWalletsKit.on(KitEventType.STATE_UPDATED, (event) => {
    const address = event.payload.address ?? null
    store.setState({ address, connected: Boolean(address) })
  })

  // Detect available wallets on creation.
  void store.getState().refreshWallets()

  // Restore the previously selected wallet WITHOUT prompting. SWK v2's
  // `fetchAddress` (used by connect) can pop a wallet prompt on page load, so we
  // only restore the selection here; the user reconnects explicitly to fetch the
  // address.
  if (typeof window !== 'undefined') {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (saved && ENABLED_WALLET_IDS.includes(saved)) {
      try {
        StellarWalletsKit.setWallet(saved)
        store.setState({ selectedWalletId: saved })
      } catch {
        // The saved wallet module is no longer available.
      }
    }
  }

  return store
}
