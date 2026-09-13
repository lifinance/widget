/**
 * Message envelope for the WebView <-> React Native wallet bridge.
 *
 * Everything crossing the boundary is a JSON string (postMessage is
 * strings-only on the RN side), tagged with `source` so the widget page's own
 * messages (config updates etc.) never collide with wallet traffic.
 */

export const BRIDGE_SOURCE = 'lifi-rn-wallet-bridge'

/** Page -> RN: an EIP-1193 request({ method, params }) call. */
export interface BridgeRequest {
  source: typeof BRIDGE_SOURCE
  kind: 'request'
  id: number
  method: string
  params?: unknown[]
}

/**
 * RN -> page: the response to a request, correlated by id.
 * Exactly one of `result` / `error` is set.
 *
 * `error` keeps the EIP-1193 ProviderRpcError shape - `code` matters:
 * 4001 user rejection is load-bearing for the widget's route execution
 * state machine (a mangled rejection leaves routes hanging "pending").
 */
export interface BridgeResponse {
  source: typeof BRIDGE_SOURCE
  kind: 'response'
  id: number
  result?: unknown
  error?: { code: number; message: string; data?: unknown }
}

/**
 * RN -> page: EIP-1193 events pushed into the page provider.
 * `chainChanged`/`accountsChanged` MUST be forwarded after switches, or
 * wagmi inside the widget desyncs from the host wallet and signs on the
 * wrong chain.
 */
export interface BridgeEvent {
  source: typeof BRIDGE_SOURCE
  kind: 'event'
  event: 'chainChanged' | 'accountsChanged' | 'connect' | 'disconnect'
  params: unknown
}

export type BridgeMessage = BridgeRequest | BridgeResponse | BridgeEvent

export const isBridgeRequest = (value: unknown): value is BridgeRequest => {
  const message = value as BridgeRequest
  return (
    !!message &&
    message.source === BRIDGE_SOURCE &&
    message.kind === 'request' &&
    typeof message.id === 'number' &&
    typeof message.method === 'string'
  )
}

/** EIP-1193 / EIP-1474 error codes the bridge uses. */
export const ProviderErrors = {
  userRejected: { code: 4001, message: 'User rejected the request.' },
  unauthorized: { code: 4100, message: 'Unauthorized.' },
  unsupportedMethod: { code: 4200, message: 'Unsupported method.' },
  disconnected: { code: 4900, message: 'Disconnected.' },
  chainNotAdded: {
    code: 4902,
    message: 'Unrecognized chain ID. Add the chain first.',
  },
  internal: { code: -32603, message: 'Internal error.' },
} as const
