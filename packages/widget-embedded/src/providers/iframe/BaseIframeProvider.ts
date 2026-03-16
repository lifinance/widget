import type { WidgetLightChainType } from '@lifi/widget-light'
import { GuestBridge } from '@lifi/widget-light'

type Listener = (...args: unknown[]) => void

export interface IframeConnectorInfo {
  name?: string
  icon?: string
}

/**
 * Base class for guest-side (iframe) providers. Handles bridge registration,
 * account/connection state tracking, RPC forwarding, and event emitting.
 *
 * Chain-specific subclasses only need to call `super(chainType)`.
 * Override `_registerBridgeCallbacks` for custom init/event handling.
 */
export class BaseIframeProvider {
  protected readonly _listeners = new Map<string, Set<Listener>>()
  protected readonly bridge = GuestBridge.getInstance()
  protected readonly chainType: WidgetLightChainType

  protected _accounts: string[] = []
  protected _connected = false
  protected _connector: IframeConnectorInfo = {}
  protected _unsubInit?: () => void
  protected _unsubEvent?: () => void

  get accounts(): string[] {
    return this._accounts
  }

  get connected(): boolean {
    return this._connected
  }

  get address(): string | null {
    return this._accounts[0] ?? null
  }

  get connector(): IframeConnectorInfo {
    return this._connector
  }

  constructor(chainType: WidgetLightChainType) {
    this.chainType = chainType
    this._registerBridgeCallbacks()
  }

  protected _registerBridgeCallbacks(): void {
    this._unsubInit = this.bridge.onInit(this.chainType, (state) => {
      const s = state as {
        accounts: string[]
        connected: boolean
        connector?: IframeConnectorInfo
      }
      this._accounts = s.accounts
      this._connected = s.connected
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
      }
      this.emit(event, data)
    })
  }

  destroy(): void {
    this._unsubInit?.()
    this._unsubEvent?.()
    this.removeAllListeners()
  }

  waitForInit(): Promise<void> {
    return this.bridge.waitForInit()
  }

  protected async sendRequest(
    method: string,
    params?: unknown
  ): Promise<unknown> {
    await this.bridge.waitForInit()

    if (method === 'getAccount') {
      return { address: this.address }
    }

    return this.bridge.sendRpcRequest(
      this.chainType,
      method,
      params as unknown[]
    )
  }

  // ---------------------------------------------------------------------------
  // Event emitter interface
  // ---------------------------------------------------------------------------

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

  removeAllListeners(event?: string): this {
    if (event) {
      this._listeners.delete(event)
    } else {
      this._listeners.clear()
    }
    return this
  }
}
