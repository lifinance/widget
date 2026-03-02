import type {
  EcosystemInitState,
  HostMessage,
  WidgetLightConfig,
} from '@lifi/widget-light'
import { WIDGET_LIGHT_SOURCE } from '@lifi/widget-light'

type Listener = (...args: unknown[]) => void

/**
 * Guest-side (iframe) provider for Solana that communicates with the host
 * window via postMessage. Implements an interface similar to the Wallet
 * Standard so that the widget's Solana provider can use it seamlessly.
 *
 * Lifecycle:
 *  1. Waits for INIT from the parent (handled externally by EthereumIframeProvider
 *     or the shared READY/INIT flow).
 *  2. Extracts the SVM ecosystem state from INIT.
 *  3. Forwards method calls (signTransaction, signMessage, etc.) as
 *     RPC_REQUEST with chainType: 'SVM'.
 *  4. Listens for EVENT messages with chainType: 'SVM' to update local state.
 */
export class SolanaIframeProvider {
  private readonly _listeners = new Map<string, Set<Listener>>()
  private readonly pendingRequests = new Map<
    string,
    { resolve: (v: unknown) => void; reject: (e: Error) => void }
  >()

  private _accounts: string[] = []
  private _connected = false
  private _config: WidgetLightConfig | null = null
  private trustedOrigin = '*'

  private readonly initPromise: Promise<void>
  private initResolve!: () => void

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
    return this._config
  }

  constructor() {
    this.initPromise = new Promise<void>((resolve) => {
      this.initResolve = resolve
    })
    window.addEventListener('message', this.handleMessage)

    setTimeout(() => {
      if (this._config === null) {
        this.initResolve()
      }
    }, 5_000)
  }

  waitForInit(): Promise<void> {
    return this.initPromise
  }

  async request(method: string, params?: unknown): Promise<unknown> {
    await this.initPromise

    if (method === 'getAccount') {
      return { address: this.address }
    }

    return this.forwardToParent(method, params)
  }

  // ---------------------------------------------------------------------------
  // Event emitter
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

  // ---------------------------------------------------------------------------
  // Private
  // ---------------------------------------------------------------------------

  private forwardToParent(method: string, params?: unknown): Promise<unknown> {
    return new Promise((resolve, reject) => {
      const id = crypto.randomUUID()
      this.pendingRequests.set(id, { resolve, reject })
      window.parent.postMessage(
        {
          source: WIDGET_LIGHT_SOURCE,
          type: 'RPC_REQUEST',
          chainType: 'SVM',
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

        const svmState = msg.ecosystems?.find(
          (e: EcosystemInitState) => e.chainType === 'SVM'
        )
        if (svmState?.state) {
          const state = svmState.state as {
            accounts: string[]
            connected: boolean
          }
          this._accounts = state.accounts
          this._connected = state.connected
        }

        this.initResolve()
        this.emit('accountsChanged', this._accounts)
        if (this._connected && this.address) {
          this.emit('connect', { address: this.address })
        }
        break
      }

      case 'RPC_RESPONSE': {
        if (msg.chainType !== 'SVM') {
          return
        }
        const pending = this.pendingRequests.get(msg.id)
        if (!pending) {
          return
        }
        this.pendingRequests.delete(msg.id)
        if (msg.error) {
          const err = new Error(msg.error.message) as Error & {
            code: number
            data?: unknown
          }
          err.code = msg.error.code
          err.data = msg.error.data
          pending.reject(err)
        } else {
          pending.resolve(msg.result)
        }
        break
      }

      case 'EVENT': {
        if (msg.chainType !== 'SVM') {
          return
        }
        if (msg.event === 'accountsChanged') {
          this._accounts = msg.data as string[]
          this._connected = this._accounts.length > 0
        }
        if (msg.event === 'disconnect') {
          this._accounts = []
          this._connected = false
        }
        this.emit(msg.event, msg.data)
        break
      }
    }
  }
}
