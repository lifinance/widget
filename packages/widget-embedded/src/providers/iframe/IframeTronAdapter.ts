import {
  Adapter,
  type AdapterName,
  AdapterState,
  type SignedTransaction,
  type Transaction,
  WalletReadyState,
} from '@tronweb3/tronwallet-abstract-adapter'
import type { TronIframeProvider } from './TronIframeProvider.js'

/**
 * Guest-side Tron adapter that delegates signing to the host
 * via the iframe bridge (TronIframeProvider -> GuestBridge -> postMessage).
 *
 * Extends the abstract Adapter class so it satisfies the getWallet return type
 * without requiring an `as unknown as Adapter` cast.
 */
export class IframeTronAdapter extends Adapter {
  name: AdapterName
  url = ''
  icon: string
  readyState: WalletReadyState = WalletReadyState.Found
  state: AdapterState = AdapterState.Connected
  address: string | null
  connecting = false

  #provider: TronIframeProvider

  constructor(provider: TronIframeProvider) {
    super()
    this.#provider = provider
    this.name = (provider.connector.name ?? 'Tron Wallet') as AdapterName
    this.icon = provider.connector.icon ?? ''
    this.address = provider.address
  }

  async connect(): Promise<void> {
    // Connection is managed by the iframe bridge — no-op here.
  }

  async signTransaction(transaction: Transaction): Promise<SignedTransaction> {
    return (await this.#provider.request('signTransaction', {
      transaction,
    })) as SignedTransaction
  }

  async signMessage(message: string): Promise<string> {
    const result = (await this.#provider.request('signMessage', {
      message,
    })) as {
      signature: string
    }
    return result.signature
  }
}
