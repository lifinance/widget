import type { RpcError, WidgetLightConfig } from '@lifi/widget-light'
import { GuestBridge } from '@lifi/widget-light'

type Listener = (...args: unknown[]) => void

/**
 * EIP-1193 compatible provider that bridges the iframe guest to the parent
 * window via postMessage. Delegates all transport concerns to `GuestBridge`.
 *
 * Lifecycle:
 *  1. GuestBridge handles the READY/INIT handshake and RESIZE reporting.
 *  2. This provider registers for EVM init state and events via the bridge.
 *  3. request() calls are either handled locally (eth_accounts, eth_chainId,
 *     net_version) or forwarded via bridge.sendRpcRequest('EVM', ...).
 *  4. EIP-1193 events (accountsChanged, chainChanged, etc.) are emitted
 *     locally for the wagmi connector to consume.
 */
export class EthereumIframeProvider {
  private readonly _listeners = new Map<string, Set<Listener>>()
  private readonly bridge = GuestBridge.getInstance()

  private accounts: string[] = []
  private _chainIdHex: `0x${string}` = '0x1'

  get chainIdHex(): `0x${string}` {
    return this._chainIdHex
  }

  get config(): WidgetLightConfig | null {
    return this.bridge.config
  }

  constructor() {
    this.bridge.onInit('EVM', (state) => {
      const s = state as { accounts: string[]; chainId: number }
      this.accounts = s.accounts
      this._chainIdHex = `0x${s.chainId.toString(16)}`

      this.emit('chainChanged', this._chainIdHex)
      this.emit('connect', { chainId: this._chainIdHex })
      this.emit('accountsChanged', this.accounts)
    })

    this.bridge.onEvent('EVM', (event, data) => {
      if (event === 'accountsChanged') {
        this.accounts = data as string[]
      }
      if (event === 'chainChanged') {
        this._chainIdHex = data as `0x${string}`
      }
      this.emit(event, data)
    })
  }

  waitForInit(): Promise<void> {
    return this.bridge.waitForInit()
  }

  async request({
    method,
    params,
  }: {
    method: string
    params?: unknown[]
  }): Promise<unknown> {
    await this.bridge.waitForInit()

    switch (method) {
      case 'eth_accounts':
      case 'eth_requestAccounts':
        return this.accounts

      case 'eth_chainId':
        return this.chainIdHex

      case 'net_version':
        return String(parseInt(this.chainIdHex, 16))

      default:
        return this.bridge.sendRpcRequest('EVM', method, params)
    }
  }

  // ---------------------------------------------------------------------------
  // EIP-1193 event emitter interface
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

export type { RpcError, WidgetLightConfig }
