import type { IframeConnectorInfo } from './BaseIframeProvider.js'
import { BaseIframeProvider } from './BaseIframeProvider.js'

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
export class EthereumIframeProvider extends BaseIframeProvider {
  private _chainIdHex: `0x${string}` = '0x1'

  get chainIdHex(): `0x${string}` {
    return this._chainIdHex
  }

  constructor() {
    super('EVM')
  }

  protected override _registerBridgeCallbacks(): void {
    this._unsubInit?.()
    this._unsubEvent?.()

    this._unsubInit = this.bridge.onInit('EVM', (state) => {
      const s = state as {
        accounts: string[]
        chainId: number
        connector?: IframeConnectorInfo
      }
      this._accounts = s.accounts
      this._connected = s.accounts.length > 0
      this._chainIdHex = `0x${s.chainId.toString(16)}`
      if (s.connector) {
        this._connector = s.connector
        this.emit('connectorUpdate', s.connector)
      }

      this.emit('chainChanged', this._chainIdHex)
      this.emit('connect', { chainId: this._chainIdHex })
      this.emit('accountsChanged', this._accounts)
    })

    this._unsubEvent = this.bridge.onEvent('EVM', (event, data) => {
      if (event === 'accountsChanged') {
        this._accounts = data as string[]
        this._connected = this._accounts.length > 0
      } else if (event === 'connect') {
        const d = data as { connector?: IframeConnectorInfo }
        if (d.connector) {
          this._connector = d.connector
          this.emit('connectorUpdate', d.connector)
        }
      } else if (event === 'chainChanged') {
        this._chainIdHex = data as `0x${string}`
      } else if (event === 'disconnect') {
        this._accounts = []
        this._connected = false
      }
      this.emit(event, data)
    })
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
        return this._accounts

      case 'eth_chainId':
        return this.chainIdHex

      case 'net_version':
        return String(Number.parseInt(this.chainIdHex, 16))

      case 'wallet_switchEthereumChain': {
        const result = await this.bridge.sendRpcRequest('EVM', method, params)
        // Optimistically update so getChainId() is correct before the
        // bridge's async chainChanged EVENT arrives. No emit here — the
        // bridge event is the single source of truth for consumers.
        const requested = (params as [{ chainId: `0x${string}` }])?.[0]?.chainId
        if (requested) {
          this._chainIdHex = requested
        }
        return result
      }

      default:
        return this.bridge.sendRpcRequest('EVM', method, params)
    }
  }
}
