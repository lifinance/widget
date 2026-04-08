import { type RefObject, useCallback, useEffect, useRef } from 'react'
import type {
  ConnectWalletArgs,
  HostMessage,
  IframeEcosystemHandler,
  RpcError,
  WidgetLightConfig,
} from '../shared/protocol.js'
import { WIDGET_LIGHT_SOURCE } from '../shared/protocol.js'
import { WidgetLightEventBus } from './WidgetLightEventBus.js'

export interface UseWidgetLightHostOptions {
  /**
   * The widget configuration to send to the iframe on initialisation.
   * Must be JSON-serialisable (no React nodes or functions).
   */
  config: WidgetLightConfig
  /**
   * Ecosystem-specific handlers that process RPC requests and push events.
   * Each handler is responsible for one chain type (EVM, SVM, UTXO, MVM).
   */
  handlers?: IframeEcosystemHandler[]
  /**
   * Expected origin of the iframe (e.g. 'https://widget.li.fi').
   * Messages from other origins are silently dropped.
   * Defaults to '*' (accept any origin) — restrict in production.
   */
  iframeOrigin?: string
  /**
   * When true, the hook listens for RESIZE messages from the guest
   * and updates the iframe element's height directly via the DOM ref.
   * Defaults to false — set to true when the iframe should grow to match
   * its content height instead of scrolling internally.
   */
  autoResize?: boolean
  /**
   * Called when the widget requests an external wallet connection.
   * If provided, the widget inside the iframe will call this instead of
   * opening its internal wallet menu. Use this to open your own wallet
   * connect modal on the host page.
   */
  onConnect?(args?: ConnectWalletArgs): void
}

/**
 * React hook for the HOST (parent) window.
 *
 * Responsibilities:
 *  - Receives READY from the iframe and responds with INIT.
 *  - Routes RPC_REQUEST messages to the matching ecosystem handler.
 *  - Forwards EVENTs from ecosystem handlers to the iframe.
 *
 * Returns a `ref` to attach to the <iframe> element.
 *
 * @example
 * function HostPage() {
 *   const ethHandler = useEthereumIframeHandler()
 *   const { iframeRef } = useWidgetLightHost({
 *     config: { integrator: 'my-app', fromChain: 1, toChain: 137 },
 *     handlers: [ethHandler],
 *     iframeOrigin: 'https://widget.li.fi',
 *   })
 *   return <iframe ref={iframeRef} src="https://widget.li.fi" />
 * }
 */
const EMPTY_HANDLERS: IframeEcosystemHandler[] = []

export function useWidgetLightHost({
  config,
  handlers = EMPTY_HANDLERS,
  iframeOrigin,
  autoResize = false,
  onConnect,
}: UseWidgetLightHostOptions): {
  iframeRef: RefObject<HTMLIFrameElement | null>
} {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const stateRef = useRef({ config, handlers, onConnect, autoResize })
  stateRef.current = { config, handlers, onConnect, autoResize }

  // Tracks whether the READY→INIT handshake has completed at least once.
  const readyRef = useRef(false)

  // ---------------------------------------------------------------------------
  // Memoised helper — stable reference so it can be a proper effect dependency
  // ---------------------------------------------------------------------------
  const sendToIframe = useCallback(
    (msg: HostMessage) => {
      if (!readyRef.current) {
        return
      }
      iframeRef.current?.contentWindow?.postMessage(msg, iframeOrigin ?? '*')
    },
    [iframeOrigin]
  )

  // ---------------------------------------------------------------------------
  // Message handler
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (iframeOrigin && event.origin !== iframeOrigin) {
        return
      }
      if (!iframeRef.current) {
        return
      }
      if (event.source !== iframeRef.current.contentWindow) {
        return
      }

      const msg = event.data
      if (!msg || msg.source !== WIDGET_LIGHT_SOURCE) {
        return
      }

      // ── READY ──────────────────────────────────────────────────────────────
      if (msg.type === 'READY') {
        const { config, handlers, onConnect, autoResize } = stateRef.current
        const ecosystems = handlers
          .map((h) => h.getInitState())
          .filter(Boolean) as NonNullable<
          ReturnType<IframeEcosystemHandler['getInitState']>
        >[]

        readyRef.current = true
        sendToIframe({
          source: WIDGET_LIGHT_SOURCE,
          type: 'INIT',
          config: enrichConfig(config, onConnect),
          ecosystems,
          autoResize,
        })
        // Re-register to replay subscriptions that were lost before the
        // iframe's JS loaded.
        WidgetLightEventBus._register(sendToIframe)
        return
      }

      // ── RESIZE ─────────────────────────────────────────────────────────────
      if (msg.type === 'RESIZE' && autoResize) {
        iframeRef.current.style.height = `${msg.height}px`
        return
      }

      // ── WIDGET_EVENT ───────────────────────────────────────────────────────
      if (msg.type === 'WIDGET_EVENT') {
        WidgetLightEventBus._receiveEvent(msg.event, msg.data)
        return
      }

      // ── CONNECT_WALLET_REQUEST ────────────────────────────────────────
      if (msg.type === 'CONNECT_WALLET_REQUEST') {
        stateRef.current.onConnect?.(msg.args)
        return
      }

      // ── RPC_REQUEST ────────────────────────────────────────────────────────
      if (msg.type === 'RPC_REQUEST') {
        const { handlers } = stateRef.current
        const handler = handlers.find((h) => h.chainType === msg.chainType)

        const sendRpcResponse = (
          payload: { result: unknown } | { error: RpcError }
        ) => {
          sendToIframe({
            source: WIDGET_LIGHT_SOURCE,
            type: 'RPC_RESPONSE',
            chainType: msg.chainType,
            id: msg.id,
            ...payload,
          })
        }

        if (!handler) {
          sendRpcResponse({
            error: {
              code: -32601,
              message: `No handler registered for chain type: ${msg.chainType}`,
            },
          })
          return
        }

        try {
          const result = await handler.handleRequest(
            msg.id,
            msg.method,
            msg.params
          )
          sendRpcResponse({ result })
        } catch (err: unknown) {
          const e = err as { code?: number; message?: string; data?: unknown }
          sendRpcResponse({
            error: {
              code: e.code ?? -32000,
              message: e.message ?? 'Unknown error',
              data: e.data,
            },
          })
        }
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [autoResize, iframeOrigin, sendToIframe])

  // ---------------------------------------------------------------------------
  // Push config updates to the iframe when config changes (after INIT)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    sendToIframe({
      source: WIDGET_LIGHT_SOURCE,
      type: 'CONFIG_UPDATE',
      config: enrichConfig(config, onConnect),
    })
  }, [config, onConnect, sendToIframe])

  // ---------------------------------------------------------------------------
  // Subscribe to each handler's events and forward them to the iframe.
  // Ref-based to avoid teardown when only the array identity changes.
  // ---------------------------------------------------------------------------
  const subscriptionsRef = useRef(new Map<IframeEcosystemHandler, () => void>())

  useEffect(() => {
    const current = subscriptionsRef.current
    const nextSet = new Set(handlers)

    for (const [handler, unsub] of current) {
      if (!nextSet.has(handler)) {
        unsub()
        current.delete(handler)
      }
    }

    for (const handler of handlers) {
      if (!current.has(handler)) {
        const unsub = handler.subscribe((event, data) => {
          sendToIframe({
            source: WIDGET_LIGHT_SOURCE,
            type: 'EVENT',
            chainType: handler.chainType,
            event,
            data,
          })
        })
        current.set(handler, unsub)
      }
    }

    return () => {
      for (const unsub of current.values()) {
        unsub()
      }
      current.clear()
    }
  }, [handlers, sendToIframe])

  // ---------------------------------------------------------------------------
  // Register/unregister the event bus send function
  // ---------------------------------------------------------------------------
  useEffect(() => {
    WidgetLightEventBus._register(sendToIframe)
    return () => {
      WidgetLightEventBus._unregister()
    }
  }, [sendToIframe])

  return { iframeRef }
}

/**
 * Injects `useExternalWalletManagement` into the config when the host
 * provides an `onConnect` callback, so the guest knows to send
 * CONNECT_WALLET_REQUEST instead of opening its internal wallet menu.
 */
function enrichConfig(
  config: WidgetLightConfig,
  onConnect?: (args?: ConnectWalletArgs) => void
): WidgetLightConfig {
  if (!onConnect) {
    return config
  }
  return {
    ...config,
    walletConfig: {
      ...config.walletConfig,
      useExternalWalletManagement: true,
    },
  }
}
