import { registerBitcoinWalletStandard } from '@metamask/bitcoin-wallet-standard'
import {
  getDefaultTransport,
  getMultichainClient,
} from '@metamask/multichain-api-client'

let registered = false

/**
 * Registers MetaMask's Bitcoin Wallet Standard adapter (it does not auto-register)
 * so the `metamask()` connector can discover it. Must run before `useReconnect`;
 * idempotent and browser-only.
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
