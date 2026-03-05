import type { WidgetLightConfig } from '@lifi/widget-light'
import { GuestBridge } from '@lifi/widget-light'

type Listener = (...args: unknown[]) => void

/**
 * Guest-side (iframe) provider for Bitcoin. Delegates transport to GuestBridge.
 *
 * Registers for UTXO init state and events, forwards method calls via
 * bridge.sendRpcRequest('UTXO', ...).
 */
export class BitcoinIframeProvider {
  private readonly _listeners = new Map<string, Set<Listener>>()
  private readonly bridge = GuestBridge.getInstance()

  private _accounts: string[] = []
  private _connected = false

  get accounts(): string[] {
    return this._accounts
  }

  get connected(): boolean {
    return this._connected
  }

  get address(): string | null {
    return this._accounts[0] ?? null
  }

  get config(): WidgetLightConfig | null {
    return this.bridge.config
  }

  constructor() {
    this.bridge.onInit('UTXO', (state) => {
      const s = state as { accounts: string[]; connected: boolean }
      this._accounts = s.accounts
      this._connected = s.connected

      this.emit('accountsChanged', this._accounts)
      if (this._connected && this.address) {
        this.emit('connect', { address: this.address })
      }
    })

    this.bridge.onEvent('UTXO', (event, data) => {
      if (event === 'accountsChanged') {
        this._accounts = data as string[]
        this._connected = this._accounts.length > 0
      }
      if (event === 'disconnect') {
        this._accounts = []
        this._connected = false
      }
      this.emit(event, data)
    })
  }

  waitForInit(): Promise<void> {
    return this.bridge.waitForInit()
  }

  async request(method: string, params?: unknown): Promise<unknown> {
    await this.bridge.waitForInit()

    if (method === 'getAccount') {
      return { address: this.address }
    }

    return this.bridge.sendRpcRequest('UTXO', method, params as unknown[])
  }

  on(event: string, listener: Listener): this {
    let set = this._listeners.get(event)
    if (!set) {
      set = new Set()
      this._listeners.set(event, set)
    }
    set.add(listener)
    return this
  }

  removeListener(event: string, listener: Listener): this {
    this._listeners.get(event)?.delete(listener)
    return this
  }

  emit(event: string, ...args: unknown[]): boolean {
    const set = this._listeners.get(event)
    if (!set || set.size === 0) {
      return false
    }
    for (const listener of set) {
      listener(...args)
    }
    return true
  }
}
