import type { IframeConnectorInfo } from './BaseIframeProvider.js'
import { BaseIframeProvider } from './BaseIframeProvider.js'

/**
 * Guest-side (iframe) provider for Bitcoin. Delegates transport to GuestBridge.
 *
 * Registers for UTXO init state and events, forwards method calls via
 * bridge.sendRpcRequest('UTXO', ...).
 *
 * Extends the base to also track the public key received from the host,
 * which is needed by the Bitcoin SDK for PSBT signing operations.
 */
export class BitcoinIframeProvider extends BaseIframeProvider {
  private _publicKey: string | null = null

  get publicKey(): string | null {
    return this._publicKey
  }

  constructor() {
    super('UTXO')
  }

  protected override _registerBridgeCallbacks(): void {
    this._unsubInit = this.bridge.onInit(this.chainType, (state) => {
      const s = state as {
        accounts: string[]
        connected: boolean
        publicKey: string | null
        connector?: IframeConnectorInfo
      }
      this._accounts = s.accounts
      this._connected = s.connected
      this._publicKey = s.publicKey ?? null
      if (s.connector) {
        this._connector = s.connector
      }

      this.emit('accountsChanged', this._accounts)
      if (this._connected && this.address) {
        this.emit('connect', { address: this.address })
      }
    })

    this._unsubEvent = this.bridge.onEvent(this.chainType, (event, data) => {
      if (event === 'accountsChanged') {
        this._accounts = data as string[]
        this._connected = this._accounts.length > 0
      } else if (event === 'connect') {
        const d = data as { connector?: IframeConnectorInfo }
        if (d.connector) {
          this._connector = d.connector
        }
      } else if (event === 'disconnect') {
        this._accounts = []
        this._connected = false
        this._publicKey = null
      }
      this.emit(event, data)
    })
  }

  request(method: string, params?: unknown): Promise<unknown> {
    return this.sendRequest(method, params)
  }
}
