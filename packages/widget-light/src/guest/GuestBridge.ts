import type {
  ConnectWalletArgs,
  EcosystemInitState,
  HostMessage,
  WidgetLightChainType,
  WidgetLightConfig,
} from '../shared/protocol.js'
import { WIDGET_LIGHT_SOURCE } from '../shared/protocol.js'

interface PendingRequest {
  resolve: (value: unknown) => void
  reject: (reason: Error) => void
  timer: ReturnType<typeof setTimeout>
}

type InitCallback = (state: unknown) => void
type EventCallback = (event: string, data: unknown) => void
type ConfigCallback = (config: WidgetLightConfig) => void
type SubscriptionChangeCallback = (event: string, subscribed: boolean) => void

const RPC_TIMEOUT_MS = 60_000

/**
 * Centralized guest-side (iframe) message bridge.
 *
 * Owns:
 *  - The single `window.addEventListener('message', ...)` handler
 *  - READY/INIT handshake with retry
 *  - Widget config storage and distribution
 *  - RESIZE reporting via ResizeObserver
 *  - RPC request/response routing (with timeout)
 *  - EVENT routing by chainType to registered ecosystem providers
 *
 * Ecosystem providers (EVM, SVM, UTXO, MVM) register as thin adapters
 * via `onInit`, `onEvent`, and call `sendRpcRequest` to forward methods.
 */
export class GuestBridge {
  private static instance: GuestBridge | null = null

  static getInstance(): GuestBridge {
    if (!GuestBridge.instance) {
      GuestBridge.instance = new GuestBridge()
    }
    return GuestBridge.instance
  }

  private readonly pendingRequests = new Map<string, PendingRequest>()
  private readonly initCallbacks = new Map<
    WidgetLightChainType,
    Set<InitCallback>
  >()
  private readonly eventCallbacks = new Map<
    WidgetLightChainType,
    Set<EventCallback>
  >()
  private readonly configCallbacks = new Set<ConfigCallback>()
  private readonly subscribedEvents = new Set<string>()
  private readonly subscriptionCallbacks = new Set<SubscriptionChangeCallback>()

  private readonly initPromise: Promise<void>
  private initResolve!: () => void

  private _config: WidgetLightConfig | null = null
  private _ecosystems: EcosystemInitState[] = []
  private trustedOrigin = '*'
  private _resizeObserver: ResizeObserver | null = null
  private _retryInterval: ReturnType<typeof setInterval> | null = null
  private _retryTimeout: ReturnType<typeof setTimeout> | null = null

  get config(): WidgetLightConfig | null {
    return this._config
  }

  private constructor() {
    this.initPromise = new Promise<void>((resolve) => {
      this.initResolve = resolve
    })

    if (typeof window === 'undefined' || window.parent === window) {
      return
    }

    window.addEventListener('message', this.handleMessage)
    this.sendReadyWithRetry()

    setTimeout(() => {
      if (this._config === null) {
        this.initResolve()
      }
    }, 5_000)
  }

  waitForInit(): Promise<void> {
    return this.initPromise
  }

  getInitState(chainType: WidgetLightChainType): unknown | undefined {
    return this._ecosystems.find((e) => e.chainType === chainType)?.state
  }

  /**
   * Forward an RPC method to the host and await the response.
   * Rejects after `RPC_TIMEOUT_MS` if no response arrives.
   */
  sendRpcRequest(
    chainType: WidgetLightChainType,
    method: string,
    params?: unknown[]
  ): Promise<unknown> {
    return new Promise((resolve, reject) => {
      const id = crypto.randomUUID()

      const timer = setTimeout(() => {
        this.pendingRequests.delete(id)
        reject(new Error(`RPC request timed out: ${method} (${id})`))
      }, RPC_TIMEOUT_MS)

      this.pendingRequests.set(id, { resolve, reject, timer })

      window.parent.postMessage(
        {
          source: WIDGET_LIGHT_SOURCE,
          type: 'RPC_REQUEST',
          chainType,
          id,
          method,
          params,
        },
        this.trustedOrigin
      )
    })
  }

  /**
   * Register a callback invoked when INIT arrives with the ecosystem's
   * state slice. Returns an unsubscribe function.
   *
   * If INIT has already been received, the callback is called immediately.
   */
  onInit(chainType: WidgetLightChainType, callback: InitCallback): () => void {
    let set = this.initCallbacks.get(chainType)
    if (!set) {
      set = new Set()
      this.initCallbacks.set(chainType, set)
    }
    set.add(callback)

    const existing = this.getInitState(chainType)
    if (existing !== undefined) {
      callback(existing)
    }

    return () => {
      set!.delete(callback)
    }
  }

  /**
   * Register a callback invoked on every EVENT for the given chainType.
   * Returns an unsubscribe function.
   */
  onEvent(
    chainType: WidgetLightChainType,
    callback: EventCallback
  ): () => void {
    let set = this.eventCallbacks.get(chainType)
    if (!set) {
      set = new Set()
      this.eventCallbacks.set(chainType, set)
    }
    set.add(callback)

    return () => {
      set!.delete(callback)
    }
  }

  /**
   * Register a callback invoked when the widget config arrives via INIT.
   * Returns an unsubscribe function.
   *
   * If INIT has already been received, the callback is called immediately.
   */
  onConfig(callback: ConfigCallback): () => void {
    this.configCallbacks.add(callback)

    if (this._config) {
      callback(this._config)
    }

    return () => {
      this.configCallbacks.delete(callback)
    }
  }

  /**
   * Register a callback invoked when the host subscribes or unsubscribes
   * from a widget event. Returns an unsubscribe function.
   */
  onWidgetEventSubscriptionChange(
    callback: SubscriptionChangeCallback
  ): () => void {
    this.subscriptionCallbacks.add(callback)
    return () => {
      this.subscriptionCallbacks.delete(callback)
    }
  }

  /**
   * Tear down the bridge: remove the message listener, disconnect the
   * ResizeObserver, clear retry timers, and reset the singleton.
   */
  destroy(): void {
    window.removeEventListener('message', this.handleMessage)
    this.clearRetryTimers()
    this._resizeObserver?.disconnect()
    this._resizeObserver = null
    this.pendingRequests.clear()
    this.initCallbacks.clear()
    this.eventCallbacks.clear()
    this.configCallbacks.clear()
    this.subscriptionCallbacks.clear()
    GuestBridge.instance = null
  }

  /** Returns the set of event names the host is currently subscribed to. */
  getSubscribedEvents(): ReadonlySet<string> {
    return this.subscribedEvents
  }

  /** Forward a widget event to the host via postMessage. */
  sendWidgetEvent(event: string, data: unknown): void {
    if (typeof window === 'undefined' || window.parent === window) {
      return
    }
    window.parent.postMessage(
      { source: WIDGET_LIGHT_SOURCE, type: 'WIDGET_EVENT', event, data },
      this.trustedOrigin
    )
  }

  /** Request the host to open its external wallet connect modal. */
  sendConnectWalletRequest(args?: ConnectWalletArgs): void {
    if (typeof window === 'undefined' || window.parent === window) {
      return
    }
    window.parent.postMessage(
      {
        source: WIDGET_LIGHT_SOURCE,
        type: 'CONNECT_WALLET_REQUEST',
        args,
      },
      this.trustedOrigin
    )
  }

  // ---------------------------------------------------------------------------
  // Private
  // ---------------------------------------------------------------------------

  private sendReadyWithRetry(): void {
    const sendReady = () => {
      window.parent.postMessage(
        { source: WIDGET_LIGHT_SOURCE, type: 'READY' },
        '*'
      )
    }

    sendReady()

    this._retryInterval = setInterval(() => {
      if (this._config !== null) {
        this.clearRetryTimers()
        return
      }
      sendReady()
    }, 250)

    this._retryTimeout = setTimeout(() => this.clearRetryTimers(), 30_000)
  }

  private clearRetryTimers(): void {
    if (this._retryInterval) {
      clearInterval(this._retryInterval)
      this._retryInterval = null
    }
    if (this._retryTimeout) {
      clearTimeout(this._retryTimeout)
      this._retryTimeout = null
    }
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
      case 'INIT':
        this.handleInit(msg, event.origin)
        break
      case 'CONFIG_UPDATE':
        this.handleConfigUpdate(msg)
        break
      case 'RPC_RESPONSE':
        this.handleRpcResponse(msg)
        break
      case 'EVENT':
        this.handleEvent(msg)
        break
      case 'WIDGET_EVENT_SUBSCRIBE':
        this.subscribedEvents.add(msg.event)
        for (const cb of this.subscriptionCallbacks) {
          cb(msg.event, true)
        }
        break
      case 'WIDGET_EVENT_UNSUBSCRIBE':
        this.subscribedEvents.delete(msg.event)
        for (const cb of this.subscriptionCallbacks) {
          cb(msg.event, false)
        }
        break
    }
  }

  private handleConfigUpdate(
    msg: Extract<HostMessage, { type: 'CONFIG_UPDATE' }>
  ): void {
    this._config = msg.config
    for (const configCb of this.configCallbacks) {
      configCb(this._config)
    }
  }

  private handleInit(
    msg: Extract<HostMessage, { type: 'INIT' }>,
    origin: string
  ): void {
    this.trustedOrigin = origin
    this._config = msg.config
    this._ecosystems = msg.ecosystems ?? []

    this.clearRetryTimers()
    this.initResolve()
    if (msg.autoResize) {
      this.startResizeReporting()
    }

    for (const configCb of this.configCallbacks) {
      configCb(this._config)
    }

    for (const eco of this._ecosystems) {
      const callbacks = this.initCallbacks.get(eco.chainType)
      if (callbacks) {
        for (const cb of callbacks) {
          cb(eco.state)
        }
      }
    }
  }

  private handleRpcResponse(
    msg: Extract<HostMessage, { type: 'RPC_RESPONSE' }>
  ): void {
    const pending = this.pendingRequests.get(msg.id)
    if (!pending) {
      return
    }
    this.pendingRequests.delete(msg.id)
    clearTimeout(pending.timer)

    if (msg.error) {
      const error = new Error(msg.error.message) as Error & {
        code: number
        data?: unknown
      }
      error.code = msg.error.code
      error.data = msg.error.data
      pending.reject(error)
    } else {
      pending.resolve(msg.result)
    }
  }

  private handleEvent(msg: Extract<HostMessage, { type: 'EVENT' }>): void {
    const callbacks = this.eventCallbacks.get(msg.chainType)
    if (!callbacks) {
      return
    }
    for (const cb of callbacks) {
      cb(msg.event, msg.data)
    }
  }

  private startResizeReporting(): void {
    if (typeof ResizeObserver === 'undefined' || this._resizeObserver) {
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

    this._resizeObserver = new ResizeObserver(() => {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(report)
    })

    this._resizeObserver.observe(document.body)
    report()
  }
}
