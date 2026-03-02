/**
 * Shared postMessage protocol for widget-light iframe bridge.
 *
 * All messages carry `source: 'widget-light'` so handlers can safely
 * ignore unrelated postMessages on the same page.
 *
 * Message flow:
 *   Guest (iframe) ──READY──────────────────────────────► Host (parent)
 *   Guest (iframe) ◄─────────────────────────────INIT── Host (parent)
 *   Guest (iframe) ──RPC_REQUEST──────────────────────► Host (parent)
 *   Guest (iframe) ◄──────────────────────RPC_RESPONSE── Host (parent)
 *   Guest (iframe) ◄──────────────────────────── EVENT── Host (parent)
 *   Guest (iframe) ──RESIZE─────────────────────────────► Host (parent)
 */

export const WIDGET_LIGHT_SOURCE = 'widget-light' as const

// ---------------------------------------------------------------------------
// WidgetLightConfig
// ---------------------------------------------------------------------------

/**
 * A serializable subset of WidgetConfig (no React nodes or functions).
 * Cast your WidgetConfig to this type before passing to useWidgetLightHost.
 */
export type WidgetLightConfig = Record<string, unknown> & {
  integrator: string
}

// ---------------------------------------------------------------------------
// RPC Error (mirrors EIP-1193 ProviderRpcError)
// ---------------------------------------------------------------------------

export interface RpcError {
  code: number
  message: string
  data?: unknown
}

// ---------------------------------------------------------------------------
// Guest → Host messages
// ---------------------------------------------------------------------------

/** Sent once when the iframe has mounted and is ready to receive config. */
export interface GuestReadyMessage {
  source: typeof WIDGET_LIGHT_SOURCE
  type: 'READY'
}

/**
 * EIP-1193 `request()` forwarded from the iframe to the parent.
 * The `id` is used to match the response.
 */
export interface GuestRpcRequest {
  source: typeof WIDGET_LIGHT_SOURCE
  type: 'RPC_REQUEST'
  id: string
  method: string
  params?: unknown[]
}

/**
 * Sent by the guest whenever the widget content height changes.
 * Allows the host to auto-resize the <iframe> element to fit the content
 * without scrollbars or clipping.
 */
export interface GuestResizeMessage {
  source: typeof WIDGET_LIGHT_SOURCE
  type: 'RESIZE'
  height: number
}

export type GuestMessage =
  | GuestReadyMessage
  | GuestRpcRequest
  | GuestResizeMessage

// ---------------------------------------------------------------------------
// Host → Guest messages
// ---------------------------------------------------------------------------

/**
 * Sent by the host in response to READY.
 * Contains the widget config and the current wallet state.
 */
export interface HostInitMessage {
  source: typeof WIDGET_LIGHT_SOURCE
  type: 'INIT'
  config: WidgetLightConfig
  chainId: number
  accounts: string[]
}

/** Response to a GuestRpcRequest. Carries either the result or an RPC error. */
export interface HostRpcResponse {
  source: typeof WIDGET_LIGHT_SOURCE
  type: 'RPC_RESPONSE'
  id: string
  result?: unknown
  error?: RpcError
}

/**
 * EIP-1193 provider events pushed from the host when wallet state changes.
 *
 * Events and their data shapes:
 *   accountsChanged → string[]
 *   chainChanged    → `0x${string}` (hex chainId per EIP-1193)
 *   connect         → { chainId: `0x${string}` }
 *   disconnect      → RpcError  (CloseEvent status code in `code`)
 */
export interface HostEventMessage {
  source: typeof WIDGET_LIGHT_SOURCE
  type: 'EVENT'
  event: 'accountsChanged' | 'chainChanged' | 'connect' | 'disconnect'
  data: unknown
}

export type HostMessage = HostInitMessage | HostRpcResponse | HostEventMessage

// ---------------------------------------------------------------------------
// Type guards
// ---------------------------------------------------------------------------

export function isWidgetLightMessage(
  data: unknown
): data is GuestMessage | HostMessage {
  return (
    typeof data === 'object' &&
    data !== null &&
    (data as Record<string, unknown>).source === WIDGET_LIGHT_SOURCE
  )
}

export function isGuestMessage(data: unknown): data is GuestMessage {
  return isWidgetLightMessage(data) && 'type' in (data as object)
}
