import type { CSSProperties } from 'react'
import type {
  ConnectWalletArgs,
  IframeEcosystemHandler,
  WidgetLightConfig,
} from '../shared/protocol.js'
import { DEFAULT_WIDGET_URL } from './constants.js'
import { useWidgetLightHost } from './useWidgetLightHost.js'

export interface WidgetLightProps {
  /**
   * URL of the widget iframe page.
   * Defaults to {@link DEFAULT_WIDGET_URL} (`'https://widget.li.fi'`).
   */
  src?: string
  /**
   * Widget configuration to pass to the iframe on init.
   * Must be JSON-serialisable (no React nodes or functions).
   */
  config: WidgetLightConfig
  /**
   * Ecosystem-specific handlers that process RPC requests and push events.
   * Each handler is responsible for one chain type (EVM, SVM, UTXO, MVM).
   */
  handlers?: IframeEcosystemHandler[]
  /**
   * Expected origin of the iframe for origin-pinning security.
   * Derived from `src` when not provided.
   */
  iframeOrigin?: string
  /**
   * When true, the iframe height auto-adjusts to match the guest content
   * via RESIZE messages. Defaults to false (the iframe fills its parent
   * and scrolls internally).
   */
  autoResize?: boolean
  /**
   * Called when the widget requests an external wallet connection.
   * When provided, the widget will send a CONNECT_WALLET_REQUEST to the
   * host instead of opening its internal wallet menu.
   */
  onConnect?(args?: ConnectWalletArgs): void
  style?: CSSProperties
  className?: string
  title?: string
}

/**
 * Drop-in host-side component that renders an `<iframe>` and automatically
 * wires up the widget-light postMessage bridge using `useWidgetLightHost`.
 *
 * @example
 * <WidgetLight
 *   src="/widget.html"
 *   config={{ integrator: 'my-app', fromChain: 1 }}
 *   handlers={[ethHandler, solHandler]}
 *   iframeOrigin="https://widget.li.fi"
 *   style={{ width: 392, height: 640, borderRadius: 16 }}
 * />
 */
export function WidgetLight({
  src = DEFAULT_WIDGET_URL,
  config,
  handlers,
  iframeOrigin = new URL(
    src,
    typeof window !== 'undefined' ? window.location.origin : undefined
  ).origin,
  autoResize,
  onConnect,
  style,
  className,
  title = 'LI.FI Widget',
}: WidgetLightProps) {
  const { iframeRef } = useWidgetLightHost({
    config,
    handlers,
    iframeOrigin,
    autoResize,
    onConnect,
  })

  return (
    <iframe
      ref={iframeRef}
      src={src}
      title={title}
      style={{ border: 'none', ...style }}
      className={className}
      allow="clipboard-write"
    />
  )
}
