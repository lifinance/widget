import { registerBitcoinWalletStandard } from '@metamask/bitcoin-wallet-standard'
import {
  getDefaultTransport,
  getMultichainClient,
} from '@metamask/multichain-api-client'

let registered = false

/**
 * Registers MetaMask's Bitcoin wallet into the Wallet Standard registry so the
 * `metamask()` Bigmi connector can discover it.
 *
 * Unlike injected Bitcoin wallets, MetaMask does not auto-register a Wallet
 * Standard wallet — it is surfaced by the `@metamask/bitcoin-wallet-standard`
 * adapter (bridging the Multichain API client → bitcoin snap), which the dapp
 * must register. This must run before `useReconnect`/connect so the wallet is
 * present in the registry. Safe to call repeatedly; only the first browser call
 * registers, and missing/old MetaMask just yields a wallet that fails to
 * connect (the wallet list still hides it via `isWalletInstalled`).
 */
export function registerMetaMaskBitcoinWallet(): void {
  if (registered || typeof window === 'undefined') {
    return
  }
  registered = true
  try {
    const client = getMultichainClient({ transport: getDefaultTransport() })
    registerBitcoinWalletStandard({ client }).catch((error) => {
      console.warn(
        'Failed to register MetaMask Bitcoin wallet standard.',
        error
      )
    })
  } catch (error) {
    console.warn('Failed to register MetaMask Bitcoin wallet standard.', error)
  }
}
