import { useCallback, useEffect, useRef } from 'react'
import type {
  ConnectWalletArgs,
  HostMessage,
  IframeEcosystemHandler,
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
   * When true (default), the hook listens for RESIZE messages from the guest
   * and updates the iframe element's height directly via the DOM ref.
   * No React state is involved — the DOM mutation is synchronous and does not
   * trigger a re-render of the host tree.
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
export function useWidgetLightHost({
  config,
  handlers = [],
  iframeOrigin,
  autoResize = true,
  onConnect,
}: UseWidgetLightHostOptions) {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const stateRef = useRef({ config, handlers, onConnect })
  stateRef.current = { config, handlers, onConnect }

  // Tracks whether the READY→INIT handshake has completed at least once.
  const readyRef = useRef(false)

  // ---------------------------------------------------------------------------
  // Memoised helper — stable reference so it can be a proper effect dependency
  // ---------------------------------------------------------------------------
  const sendToIframe = useCallback(
    (msg: HostMessage) => {
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
        const { config, handlers, onConnect } = stateRef.current
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
        })
        return
      }

      // ── RESIZE ─────────────────────────────────────────────────────────────
      if (msg.type === 'RESIZE' && autoResize) {
        if (iframeRef.current) {
          iframeRef.current.style.height = `${msg.height}px`
        }
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
        if (!handler) {
          sendToIframe({
            source: WIDGET_LIGHT_SOURCE,
            type: 'RPC_RESPONSE',
            chainType: msg.chainType,
            id: msg.id,
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
          sendToIframe({
            source: WIDGET_LIGHT_SOURCE,
            type: 'RPC_RESPONSE',
            chainType: msg.chainType,
            id: msg.id,
            result,
          })
        } catch (err: unknown) {
          const e = err as { code?: number; message?: string; data?: unknown }
          sendToIframe({
            source: WIDGET_LIGHT_SOURCE,
            type: 'RPC_RESPONSE',
            chainType: msg.chainType,
            id: msg.id,
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
    if (readyRef.current) {
      sendToIframe({
        source: WIDGET_LIGHT_SOURCE,
        type: 'CONFIG_UPDATE',
        config: enrichConfig(config, onConnect),
      })
    }
  }, [config, onConnect, sendToIframe])

  // ---------------------------------------------------------------------------
  // Subscribe to each handler's events and forward them to the iframe
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const unsubscribes = handlers.map((handler) =>
      handler.subscribe((event, data) => {
        sendToIframe({
          source: WIDGET_LIGHT_SOURCE,
          type: 'EVENT',
          chainType: handler.chainType,
          event,
          data,
        })
      })
    )
    return () => {
      for (const unsub of unsubscribes) {
        unsub()
      }
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
