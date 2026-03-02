import type { CSSProperties } from 'react'
import type {
  IframeEcosystemHandler,
  WidgetLightConfig,
} from '../shared/protocol.js'
import { useWidgetLightHost } from './useWidgetLightHost.js'

export interface WidgetLightProps {
  /** URL of the widget iframe page. */
  src: string
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
   * Defaults to '*' — always set this in production.
   */
  iframeOrigin?: string
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
 *   iframeOrigin="http://localhost:4000"
 *   style={{ width: 392, height: 640, borderRadius: 16 }}
 * />
 */
export function WidgetLight({
  src,
  config,
  handlers,
  iframeOrigin,
  style,
  className,
  title = 'LI.FI Widget',
}: WidgetLightProps) {
  const { iframeRef } = useWidgetLightHost({
    config,
    handlers,
    iframeOrigin,
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
