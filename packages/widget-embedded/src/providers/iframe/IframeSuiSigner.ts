import type { PublicKey, SignatureScheme } from '@mysten/sui/cryptography'
import { Signer } from '@mysten/sui/cryptography'
import type { SuiIframeProvider } from './SuiIframeProvider.js'

/**
 * Guest-side Signer that delegates all signing operations to the host
 * via the iframe bridge (SuiIframeProvider → GuestBridge → postMessage).
 *
 * The host receives RPC_REQUEST messages and uses the real wallet
 * (via dapp-kit-react's CurrentAccountSigner) to sign.
 */
export class IframeSuiSigner extends Signer {
  #address: string
  #provider: SuiIframeProvider

  constructor(address: string, provider: SuiIframeProvider) {
    super()
    this.#address = address
    this.#provider = provider
  }

  override toSuiAddress(): string {
    return this.#address
  }

  getKeyScheme(): SignatureScheme {
    throw new Error('getKeyScheme is not available in iframe context')
  }

  getPublicKey(): PublicKey {
    throw new Error('getPublicKey is not available in iframe context') as never
  }

  async sign(_bytes: Uint8Array): Promise<Uint8Array<ArrayBuffer>> {
    throw new Error('Raw sign is not available in iframe context')
  }

  override async signTransaction(
    bytes: Uint8Array
  ): Promise<{ bytes: string; signature: string }> {
    const base64 = btoa(String.fromCharCode(...bytes))
    const result = await this.#provider.request('signTransaction', {
      transaction: base64,
    })
    return result as { bytes: string; signature: string }
  }

  override async signPersonalMessage(
    bytes: Uint8Array
  ): Promise<{ bytes: string; signature: string }> {
    const base64 = btoa(String.fromCharCode(...bytes))
    const result = await this.#provider.request('signPersonalMessage', {
      message: base64,
    })
    return result as { bytes: string; signature: string }
  }
}
