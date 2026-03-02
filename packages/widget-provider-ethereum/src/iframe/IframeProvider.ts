import type {
  EcosystemInitState,
  HostMessage,
  RpcError,
  WidgetLightConfig,
} from '@lifi/widget-light'
import { WIDGET_LIGHT_SOURCE } from '@lifi/widget-light'

// ---------------------------------------------------------------------------
// Minimal EventEmitter — avoids any dependency on Node.js `events` or
// `eventemitter3`. Satisfies the EIP-1193 provider event interface.
// ---------------------------------------------------------------------------
type Listener = (...args: unknown[]) => void

class MinimalEventEmitter {
  private readonly _listeners = new Map<string, Set<Listener>>()

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

interface PendingRequest {
  resolve: (value: unknown) => void
  reject: (reason: Error) => void
}

/**
 * EIP-1193 compatible provider that bridges the iframe guest to the parent
 * window via postMessage.
 *
 * Lifecycle:
 *  1. Constructor sends READY to the parent.
 *  2. Parent responds with INIT (config + ecosystem states).
 *  3. All subsequent request() calls are either handled locally (eth_accounts,
 *     eth_chainId, net_version) or forwarded to the parent as RPC_REQUEST
 *     with chainType: 'EVM'.
 *  4. Parent pushes EVENT messages for EIP-1193 events (accountsChanged, etc.).
 */
export class EthereumIframeProvider extends MinimalEventEmitter {
  private readonly pendingRequests = new Map<string, PendingRequest>()

  private readonly initPromise: Promise<void>
  private initResolve!: () => void

  private accounts: string[] = []
  private _chainIdHex: `0x${string}` = '0x1'

  get chainIdHex(): `0x${string}` {
    return this._chainIdHex
  }

  private trustedOrigin = '*'
  private _config: WidgetLightConfig | null = null

  constructor() {
    super()

    this.initPromise = new Promise<void>((resolve) => {
      this.initResolve = resolve
    })

    window.addEventListener('message', this.handleMessage)
    this.sendReadyWithRetry()

    setTimeout(() => {
      if (this._config === null) {
        this.initResolve()
      }
    }, 5_000)
  }

  private sendReadyWithRetry(): void {
    const sendReady = () => {
      window.parent.postMessage(
        { source: WIDGET_LIGHT_SOURCE, type: 'READY' },
        '*'
      )
    }

    sendReady()

    const interval = setInterval(() => {
      if (this._config !== null) {
        clearInterval(interval)
        return
      }
      sendReady()
    }, 250)

    setTimeout(() => clearInterval(interval), 30_000)
  }

  get config(): WidgetLightConfig | null {
    return this._config
  }

  waitForInit(): Promise<void> {
    return this.initPromise
  }

  async request({
    method,
    params,
  }: {
    method: string
    params?: unknown[]
  }): Promise<unknown> {
    await this.initPromise

    switch (method) {
      case 'eth_accounts':
      case 'eth_requestAccounts':
        return this.accounts

      case 'eth_chainId':
        return this.chainIdHex

      case 'net_version':
        return String(parseInt(this.chainIdHex, 16))

      default:
        return this.forwardToParent(method, params)
    }
  }

  // ---------------------------------------------------------------------------
  // Private
  // ---------------------------------------------------------------------------

  private forwardToParent(
    method: string,
    params?: unknown[]
  ): Promise<unknown> {
    return new Promise((resolve, reject) => {
      const id = crypto.randomUUID()
      this.pendingRequests.set(id, { resolve, reject })
      window.parent.postMessage(
        {
          source: WIDGET_LIGHT_SOURCE,
          type: 'RPC_REQUEST',
          chainType: 'EVM',
          id,
          method,
          params,
        },
        this.trustedOrigin
      )
    })
  }

  private readonly handleMessage = (event: MessageEvent): void => {
    if (this.trustedOrigin !== '*' && event.origin !== this.trustedOrigin) {
      return
    }
    if (event.source !== window.parent) {
      return
    }

    const msg = event.data as HostMessage
    if (!msg || msg.source !== WIDGET_LIGHT_SOURCE) {
      return
    }

    switch (msg.type) {
      case 'INIT': {
        this.trustedOrigin = event.origin
        this._config = msg.config

        const evmState = msg.ecosystems?.find(
          (e: EcosystemInitState) => e.chainType === 'EVM'
        )
        if (evmState?.state) {
          const state = evmState.state as {
            accounts: string[]
            chainId: number
          }
          this.accounts = state.accounts
          this._chainIdHex = `0x${state.chainId.toString(16)}`
        }

        this.initResolve()
        this.startResizeReporting()

        this.emit('chainChanged', this._chainIdHex)
        this.emit('connect', { chainId: this._chainIdHex })
        this.emit('accountsChanged', this.accounts)
        break
      }

      case 'RPC_RESPONSE': {
        if (msg.chainType !== 'EVM') {
          return
        }
        const pending = this.pendingRequests.get(msg.id)
        if (!pending) {
          return
        }
        this.pendingRequests.delete(msg.id)
        if (msg.error) {
          pending.reject(
            makeRpcError(msg.error.code, msg.error.message, msg.error.data)
          )
        } else {
          pending.resolve(msg.result)
        }
        break
      }

      case 'EVENT': {
        if (msg.chainType !== 'EVM') {
          return
        }
        if (msg.event === 'accountsChanged') {
          this.accounts = msg.data as string[]
        }
        if (msg.event === 'chainChanged') {
          this._chainIdHex = msg.data as `0x${string}`
        }
        this.emit(msg.event, msg.data)
        break
      }
    }
  }

  private startResizeReporting(): void {
    if (typeof ResizeObserver === 'undefined') {
      return
    }

    let lastHeight = 0
    let rafId = 0

    const report = () => {
      const height = document.body.offsetHeight
      if (height !== lastHeight) {
        lastHeight = height
        window.parent.postMessage(
          { source: WIDGET_LIGHT_SOURCE, type: 'RESIZE', height },
          this.trustedOrigin
        )
      }
    }

    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(report)
    })

    ro.observe(document.body)
    report()
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeRpcError(code: number, message: string, data?: unknown): Error {
  const error = new Error(message) as Error & {
    code: number
    data?: unknown
  }
  error.code = code
  error.data = data
  return error
}

export type { RpcError, WidgetLightConfig }
