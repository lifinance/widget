/**
 * Shared postMessage protocol for widget-light iframe bridge.
 *
 * All messages carry `source: 'widget-light'` so handlers can safely
 * ignore unrelated postMessages on the same page.
 *
 * Message flow:
 *   Guest (iframe) ──READY──────────────────────────────► Host (parent)
 *   Guest (iframe) ◄─────────────────────────────INIT── Host (parent)
 *   Guest (iframe) ◄──────────────────CONFIG_UPDATE── Host (parent)
 *   Guest (iframe) ──RPC_REQUEST──────────────────────► Host (parent)
 *   Guest (iframe) ◄──────────────────────RPC_RESPONSE── Host (parent)
 *   Guest (iframe) ◄──────────────────────────── EVENT── Host (parent)
 *   Guest (iframe) ──RESIZE─────────────────────────────► Host (parent)
 *   Guest (iframe) ──WIDGET_EVENT─────────────────────► Host (parent)
 *   Guest (iframe) ◄────────── WIDGET_EVENT_SUBSCRIBE── Host (parent)
 *   Guest (iframe) ◄──────── WIDGET_EVENT_UNSUBSCRIBE── Host (parent)
 *   Guest (iframe) ──CONNECT_WALLET_REQUEST────────────► Host (parent)
 */

import type { WidgetChainType, WidgetLightConfig } from './widgetConfig.js'

export type { WidgetLightConfig } from './widgetConfig.js'

export const WIDGET_LIGHT_SOURCE = 'widget-light' as const

// ---------------------------------------------------------------------------
// Chain type discriminator
// ---------------------------------------------------------------------------

export type WidgetLightChainType = 'EVM' | 'SVM' | 'UTXO' | 'MVM'

// ---------------------------------------------------------------------------
// RPC Error (mirrors EIP-1193 ProviderRpcError)
// ---------------------------------------------------------------------------

export interface RpcError {
  code: number
  message: string
  data?: unknown
}

// ---------------------------------------------------------------------------
// Ecosystem init state — per-chain-type payload inside INIT
// ---------------------------------------------------------------------------

export interface EcosystemInitState {
  chainType: WidgetLightChainType
  state: unknown
}

// ---------------------------------------------------------------------------
// Handler interface — implemented by each widget-provider-* package
// ---------------------------------------------------------------------------

export interface IframeEcosystemHandler {
  chainType: WidgetLightChainType
  /** Initial state sent with INIT (e.g. { accounts, chainId } for EVM). */
  getInitState(): EcosystemInitState | null
  /** Handle an RPC request forwarded from the guest iframe. */
  handleRequest(id: string, method: string, params?: unknown): Promise<unknown>
  /** Subscribe to wallet state changes; callback sends EVENTs to guest.
   *  Returns an unsubscribe function. */
  subscribe(emit: (event: string, data: unknown) => void): () => void
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
 * RPC `request()` forwarded from the iframe to the parent.
 * The `id` is used to match the response; `chainType` routes to the
 * correct ecosystem handler on the host.
 */
export interface GuestRpcRequest {
  source: typeof WIDGET_LIGHT_SOURCE
  type: 'RPC_REQUEST'
  chainType: WidgetLightChainType
  id: string
  method: string
  params?: unknown
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

/**
 * Widget event forwarded from the guest to the host.
 * Only sent for events that the host has subscribed to.
 */
export interface GuestWidgetEvent {
  source: typeof WIDGET_LIGHT_SOURCE
  type: 'WIDGET_EVENT'
  event: string
  data: unknown
}

/** Serializable args for the external wallet connect request. */
export interface ConnectWalletArgs {
  chainId?: number
  chainType?: WidgetChainType
}

/**
 * Sent by the guest when `walletConfig.onConnect` is triggered inside the
 * widget. The host should open its own wallet connection modal.
 */
export interface GuestConnectWalletRequest {
  source: typeof WIDGET_LIGHT_SOURCE
  type: 'CONNECT_WALLET_REQUEST'
  args?: ConnectWalletArgs
}

export type GuestMessage =
  | GuestReadyMessage
  | GuestRpcRequest
  | GuestResizeMessage
  | GuestWidgetEvent
  | GuestConnectWalletRequest

// ---------------------------------------------------------------------------
// Host → Guest messages
// ---------------------------------------------------------------------------

/**
 * Sent by the host in response to READY.
 * Contains the widget config and per-ecosystem initial wallet state.
 */
export interface HostInitMessage {
  source: typeof WIDGET_LIGHT_SOURCE
  type: 'INIT'
  config: WidgetLightConfig
  ecosystems: EcosystemInitState[]
  /** When true, the guest should report content height changes via RESIZE. */
  autoResize?: boolean
}

/** Response to a GuestRpcRequest. Carries either the result or an RPC error. */
export interface HostRpcResponse {
  source: typeof WIDGET_LIGHT_SOURCE
  type: 'RPC_RESPONSE'
  chainType: WidgetLightChainType
  id: string
  result?: unknown
  error?: RpcError
}

/**
 * Wallet events pushed from the host when wallet state changes.
 * Routed to the guest ecosystem provider matching `chainType`.
 */
export interface HostEventMessage {
  source: typeof WIDGET_LIGHT_SOURCE
  type: 'EVENT'
  chainType: WidgetLightChainType
  event: string
  data: unknown
}

/** Sent by the host when the widget config changes after INIT. */
export interface HostConfigUpdateMessage {
  source: typeof WIDGET_LIGHT_SOURCE
  type: 'CONFIG_UPDATE'
  config: WidgetLightConfig
}

/** Subscribe to a specific widget event forwarded from the guest. */
export interface HostWidgetEventSubscribe {
  source: typeof WIDGET_LIGHT_SOURCE
  type: 'WIDGET_EVENT_SUBSCRIBE'
  event: string
}

/** Unsubscribe from a specific widget event. */
export interface HostWidgetEventUnsubscribe {
  source: typeof WIDGET_LIGHT_SOURCE
  type: 'WIDGET_EVENT_UNSUBSCRIBE'
  event: string
}

export type HostMessage =
  | HostInitMessage
  | HostConfigUpdateMessage
  | HostRpcResponse
  | HostEventMessage
  | HostWidgetEventSubscribe
  | HostWidgetEventUnsubscribe

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
