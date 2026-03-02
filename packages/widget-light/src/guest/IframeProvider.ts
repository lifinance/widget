import type {
  HostMessage,
  RpcError,
  WidgetLightConfig,
} from '../shared/protocol.js'
import { WIDGET_LIGHT_SOURCE } from '../shared/protocol.js'

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
 *  2. Parent responds with INIT (config + initial accounts/chainId).
 *  3. All subsequent request() calls are either handled locally (eth_accounts,
 *     eth_chainId, net_version) or forwarded to the parent as RPC_REQUEST.
 *  4. Parent pushes EVENT messages for EIP-1193 events (accountsChanged, etc.).
 *
 * EIP-5792 methods (wallet_sendCalls, wallet_getCallsStatus, etc.) are
 * forwarded transparently to the parent just like any other RPC method.
 */
export class IframeProvider extends MinimalEventEmitter {
  private readonly pendingRequests = new Map<string, PendingRequest>()

  /** Resolves once the INIT message arrives from the parent. */
  private readonly initPromise: Promise<void>
  private initResolve!: () => void

  /** Cached from INIT / EVENT messages — avoids a round-trip for common reads. */
  private accounts: string[] = []
  private _chainIdHex: `0x${string}` = '0x1'

  /** Current chain ID as a hex string, kept in sync via EVENT messages. */
  get chainIdHex(): `0x${string}` {
    return this._chainIdHex
  }

  /**
   * The origin we accept further messages from.
   * Set to event.origin of the first INIT message — prevents spoofing.
   */
  private trustedOrigin = '*'

  /** Config received from the parent during INIT. */
  private _config: WidgetLightConfig | null = null

  constructor() {
    super()

    this.initPromise = new Promise<void>((resolve) => {
      this.initResolve = resolve
    })

    window.addEventListener('message', this.handleMessage)
    this.sendReadyWithRetry()

    // Safety valve: if INIT never arrives (e.g. host not running), resolve
    // with empty state after 5 s so wagmi's reconnect doesn't block forever.
    setTimeout(() => {
      if (this._config === null) {
        this.initResolve()
      }
    }, 5_000)
  }

  /**
   * Sends READY to the parent and retries every 250 ms until INIT arrives.
   *
   * This handles the race where the iframe's JavaScript initialises faster
   * than the host's React useEffect sets up its message handler. Without
   * retries, the single READY could be sent into the void and the iframe
   * would wait forever for INIT.
   */
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

    // Give up after 30 s — at that point the user will have to reload anyway.
    setTimeout(() => clearInterval(interval), 30_000)
  }

  /** Returns the config received from the parent, or null before INIT. */
  get config(): WidgetLightConfig | null {
    return this._config
  }

  /** Waits until the INIT message has been received. */
  waitForInit(): Promise<void> {
    return this.initPromise
  }

  /**
   * EIP-1193 `request()` implementation.
   *
   * Common read methods (eth_accounts, eth_chainId, net_version) are served
   * from local cache to avoid latency. Everything else (including EIP-5792
   * wallet_sendCalls / wallet_getCallsStatus / wallet_getCapabilities) is
   * forwarded to the parent as a RPC_REQUEST and awaits its RPC_RESPONSE.
   */
  async request({
    method,
    params,
  }: {
    method: string
    params?: unknown[]
  }): Promise<unknown> {
    // Block until INIT arrives so we have accounts/chainId
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
          id,
          method,
          params,
        },
        this.trustedOrigin
      )
    })
  }

  private readonly handleMessage = (event: MessageEvent): void => {
    // After INIT we only accept messages from the trusted origin
    if (this.trustedOrigin !== '*' && event.origin !== this.trustedOrigin) {
      return
    }
    // Ignore messages that don't come from the parent frame
    if (event.source !== window.parent) {
      return
    }

    const msg = event.data as HostMessage
    if (!msg || msg.source !== WIDGET_LIGHT_SOURCE) {
      return
    }

    switch (msg.type) {
      case 'INIT': {
        // Pin the trusted origin on first contact
        this.trustedOrigin = event.origin
        this._config = msg.config
        this.accounts = msg.accounts
        this._chainIdHex = `0x${msg.chainId.toString(16)}`

        // Resolve pending init so request() calls can proceed
        this.initResolve()

        // Start reporting content size to the host now that we have a trusted
        // origin. The host uses these to auto-resize the <iframe> element.
        this.startResizeReporting()

        // Emit EIP-1193 events so the Wagmi connector can react
        this.emit('chainChanged', this._chainIdHex)
        this.emit('connect', { chainId: this._chainIdHex })
        // Always emit accountsChanged (even for [] so connector knows state)
        this.emit('accountsChanged', msg.accounts)
        break
      }

      case 'RPC_RESPONSE': {
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
        // Update local cache on state changes
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

  /**
   * Observes document.body with ResizeObserver and posts a RESIZE message to
   * the host whenever the widget content height changes.
   *
   * Called once after INIT so that `trustedOrigin` is already pinned and the
   * host is ready to handle messages.
   *
   * Measurement strategy:
   *   We read document.body.offsetHeight (the body's rendered height driven by
   *   its content) rather than document.documentElement.scrollHeight, which can
   *   be clamped to the viewport when html/body have height:100%.  Only the
   *   height is reported — width is fixed by the host's CSS.
   *
   * Loop prevention:
   *   We track the last reported height and skip the postMessage when the value
   *   hasn't changed. When the host updates the iframe height in response, the
   *   body content height stays the same (it is content-driven, not viewport-
   *   driven), so no feedback loop occurs.
   */
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
      // Debounce via rAF — coalesces rapid layout changes within a single frame.
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(report)
    })

    ro.observe(document.body)
    // Send immediately so the host can size the iframe before first paint.
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
