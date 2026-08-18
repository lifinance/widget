import {
  KitEventType,
  StellarWalletsKit,
} from '@creit.tech/stellar-wallets-kit'
import { XBULL_ID } from '@creit.tech/stellar-wallets-kit/modules/xbull'
import { create } from 'zustand'
import type { StellarProviderConfig } from '../types.js'
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

// Best effort: only Freighter, Klever and Bitget implement getNetwork.
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

export function createStellarWalletsKitStore(
  config?: StellarProviderConfig
): StellarWalletsKitStore {
  const { networkPassphrase } = initStellarWalletsKit(config)

  let refreshing: Promise<void> | undefined

  const store = create<StellarWalletsKitState>((set) => ({
    networkPassphrase,
    wallets: [],
    selectedWalletId: null,
    selectedWallet: null,
    address: null,
    connected: false,
    connecting: false,
    refreshWallets() {
      if (!refreshing) {
        refreshing = StellarWalletsKit.refreshSupportedWallets()
          .then((supported) => {
            set({
              wallets: supported
                .filter((wallet) => ENABLED_WALLET_IDS.includes(wallet.id))
                .map((wallet) => ({
                  id: wallet.id,
                  name: wallet.name,
                  icon: wallet.icon,
                  isAvailable: isWalletInstalled(wallet.id, wallet.isAvailable),
                })),
            })
          })
          .finally(() => {
            refreshing = undefined
          })
      }
      return refreshing
    },
    async connect(walletId: string) {
      set({ connecting: true })
      try {
        StellarWalletsKit.setWallet(walletId)
        const { address } = await StellarWalletsKit.fetchAddress()
        try {
          await assertWalletNetwork(networkPassphrase)
        } catch (error) {
          await safeDisconnect()
          throw error
        }
        set({ address, connected: Boolean(address), connecting: false })
        return address ?? null
      } catch (error) {
        set({ connecting: false })
        throw error
      }
    },
    async disconnect() {
      // SWK's `disconnect()` calls the active module's own `disconnect()`
      // without awaiting it, so a WalletConnect session teardown that rejects
      // asynchronously escapes upstream; this only catches what SWK surfaces.
      await safeDisconnect()
      set({ address: null, connected: false })
    },
    async isWalletReachable() {
      try {
        return await StellarWalletsKit.selectedModule.isAvailable()
      } catch {
        return false
      }
    },
  }))

  // Keep the store's address in sync with the kit's internal state (also fires
  // on external disconnects and at launch, since SWK restores the address).
  // The store is a process-lifetime singleton, so these listeners live as long as the page.
  StellarWalletsKit.on(KitEventType.STATE_UPDATED, (event) => {
    const address = event.payload.address ?? null
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
