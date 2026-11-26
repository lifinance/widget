import {
  activeAddress,
  type IOnChangeEvent,
  type ModuleInterface,
} from '@creit.tech/stellar-wallets-kit'
import type { MetaMaskStellarModule } from './metaMaskStellarModule.js'
import type { StellarWalletsKitStore } from './types.js'

export type WatchedMetaMask = Pick<
  MetaMaskStellarModule,
  'productId' | 'onSessionEnd' | 'checkSessionEnded'
>

/**
 * Keeps the store in step with what the wallets report. SWK never calls a
 * module's `onChange` and never learns that MetaMask ended a session, so a
 * switched account or a revoked session would otherwise leave a stale address.
 *
 * Call it after the store's kit subscriptions: they set the restored wallet
 * and address that the page-load check reads.
 */
export function watchWalletSessions(
  store: StellarWalletsKitStore,
  modules: readonly ModuleInterface[],
  metaMask: WatchedMetaMask
): void {
  const isConnectedTo = (productId: string): boolean => {
    const { selectedWalletId, connected } = store.getState()
    return connected && selectedWalletId === productId
  }

  for (const module of modules) {
    if (!module.onChange) {
      continue
    }
    const onAccountChange = (event: IOnChangeEvent) => {
      if (
        !isConnectedTo(module.productId) ||
        event.error ||
        !event.address ||
        event.address === store.getState().address
      ) {
        return
      }
      // Not `fetchAddress()`: Scopuly's getAddress calls requestAccess, which
      // can prompt. SWK persists the signal and fires STATE_UPDATED, which
      // updates the store.
      activeAddress.value = event.address
    }
    try {
      module.onChange(onAccountChange)
    } catch (error) {
      console.warn(
        `Failed to watch ${module.productName} account changes:`,
        error
      )
    }
  }

  const disconnectMetaMask = () =>
    store
      .getState()
      .disconnect()
      .catch((error) => {
        console.warn('Failed to disconnect MetaMask Stellar:', error)
      })

  metaMask.onSessionEnd(() => {
    if (isConnectedTo(metaMask.productId)) {
      void disconnectMetaMask()
    }
  })

  // A restored session can outlive the MetaMask session behind it. Disconnect
  // only on MetaMask's clear "no Stellar scope" answer.
  if (isConnectedTo(metaMask.productId)) {
    metaMask
      .checkSessionEnded()
      .then((ended) => {
        // The user may have picked another wallet while MetaMask answered.
        if (ended && isConnectedTo(metaMask.productId)) {
          return disconnectMetaMask()
        }
      })
      .catch((error) => {
        console.warn('Failed to check the MetaMask Stellar session:', error)
      })
  }
}
