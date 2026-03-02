import { useCallback, useEffect, useRef } from 'react'
import type {
  HostMessage,
  IframeEcosystemHandler,
  WidgetLightConfig,
} from '../shared/protocol.js'
import { WIDGET_LIGHT_SOURCE } from '../shared/protocol.js'

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
   * Expected origin of the iframe (e.g. 'http://localhost:4000').
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
 *     iframeOrigin: 'http://localhost:4000',
 *   })
 *   return <iframe ref={iframeRef} src="http://localhost:4000/widget.html" />
 * }
 */
export function useWidgetLightHost({
  config,
  handlers = [],
  iframeOrigin,
  autoResize = true,
}: UseWidgetLightHostOptions) {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const stateRef = useRef({ config, handlers })
  stateRef.current = { config, handlers }

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
        const { config, handlers } = stateRef.current
        const ecosystems = handlers
          .map((h) => h.getInitState())
          .filter(Boolean) as NonNullable<
          ReturnType<IframeEcosystemHandler['getInitState']>
        >[]

        sendToIframe({
          source: WIDGET_LIGHT_SOURCE,
          type: 'INIT',
          config,
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

  return { iframeRef }
}
