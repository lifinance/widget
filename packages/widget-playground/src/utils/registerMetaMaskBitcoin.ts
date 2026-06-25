import { registerBitcoinWalletStandard } from '@metamask/bitcoin-wallet-standard'
import {
  getDefaultTransport,
  getMultichainClient,
} from '@metamask/multichain-api-client'

let registered = false

// Opt-in MetaMask Bitcoin: integrators install `@metamask/bitcoin-wallet-standard`
// + `@metamask/multichain-api-client`, register the adapter once before the
// Bitcoin provider mounts, and add `metamask()` to the bigmi connectors.
export function registerMetaMaskBitcoin(): void {
  if (registered || typeof window === 'undefined') {
    return
  }
  registered = true
  registerBitcoinWalletStandard({
    client: getMultichainClient({ transport: getDefaultTransport() }),
  })
}
