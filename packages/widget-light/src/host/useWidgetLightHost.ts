import { useCallback, useEffect, useRef } from 'react'
import {
  useConnection,
  usePublicClient,
  useSwitchChain,
  useWalletClient,
} from 'wagmi'
import type { HostMessage, WidgetLightConfig } from '../shared/protocol.js'
import { WIDGET_LIGHT_SOURCE } from '../shared/protocol.js'
import { handleRpcRequest } from './rpcHandler.js'

export interface UseWidgetLightHostOptions {
  /**
   * The widget configuration to send to the iframe on initialisation.
   * Must be JSON-serialisable (no React nodes or functions).
   */
  config: WidgetLightConfig
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
 *  - Routes RPC_REQUEST messages to viem WalletClient / PublicClient.
 *  - Pushes EIP-1193 events (accountsChanged, chainChanged) to the iframe
 *    whenever the host's wallet state changes.
 *
 * Returns a `ref` to attach to the <iframe> element.
 *
 * @example
 * function HostPage() {
 *   const { iframeRef } = useWidgetLightHost({
 *     config: { integrator: 'my-app', fromChain: 1, toChain: 137 },
 *     iframeOrigin: 'http://localhost:4000',
 *   })
 *   return <iframe ref={iframeRef} src="http://localhost:4000/widget.html" />
 * }
 */
export function useWidgetLightHost({
  config,
  iframeOrigin,
  autoResize = true,
}: UseWidgetLightHostOptions) {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // wagmi v3: useAccount renamed to useConnection
  const { address, chainId } = useConnection()
  const { data: walletClient } = useWalletClient()
  const publicClient = usePublicClient()
  // wagmi v3: switchChainAsync renamed to mutateAsync
  const { mutateAsync: switchChainAsync } = useSwitchChain()

  // Keep the latest values in a ref so the stable message handler closure
  // always reads fresh state without being re-created on every render.
  const stateRef = useRef({
    address,
    chainId,
    walletClient,
    publicClient,
    config,
  })
  stateRef.current = { address, chainId, walletClient, publicClient, config }

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
        const { address, chainId, config } = stateRef.current
        sendToIframe({
          source: WIDGET_LIGHT_SOURCE,
          type: 'INIT',
          config,
          chainId: chainId ?? 1,
          accounts: address ? [address] : [],
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
        const { address, chainId, walletClient, publicClient } =
          stateRef.current
        try {
          const result = await handleRpcRequest(msg.method, msg.params, {
            address,
            chainId,
            walletClient,
            publicClient,
            switchChain: async (targetChainId) => {
              await switchChainAsync({ chainId: targetChainId })
            },
          })
          sendToIframe({
            source: WIDGET_LIGHT_SOURCE,
            type: 'RPC_RESPONSE',
            id: msg.id,
            result,
          })
        } catch (err: unknown) {
          const e = err as { code?: number; message?: string; data?: unknown }
          sendToIframe({
            source: WIDGET_LIGHT_SOURCE,
            type: 'RPC_RESPONSE',
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
  }, [autoResize, iframeOrigin, sendToIframe, switchChainAsync])

  // ---------------------------------------------------------------------------
  // Push accountsChanged whenever the host account changes
  // ---------------------------------------------------------------------------
  useEffect(() => {
    sendToIframe({
      source: WIDGET_LIGHT_SOURCE,
      type: 'EVENT',
      event: 'accountsChanged',
      data: address ? [address] : [],
    })
  }, [address, sendToIframe])

  // ---------------------------------------------------------------------------
  // Push chainChanged + connect whenever the host chain changes
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!chainId) {
      return
    }
    const hexChainId = `0x${chainId.toString(16)}` as const
    sendToIframe({
      source: WIDGET_LIGHT_SOURCE,
      type: 'EVENT',
      event: 'chainChanged',
      data: hexChainId,
    })
    sendToIframe({
      source: WIDGET_LIGHT_SOURCE,
      type: 'EVENT',
      event: 'connect',
      data: { chainId: hexChainId },
    })
  }, [chainId, sendToIframe])

  return { iframeRef }
}
