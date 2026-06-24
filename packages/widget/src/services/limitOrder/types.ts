import type { Route } from '@lifi/sdk'

/**
 * Request for the limit-order API's `advanced/routes` endpoint. Mirrors the
 * LiFi `RoutesRequest` shape and adds the three limit-order fields
 * (`toAmount`, `validUntil`, `partiallyFillable`). See [[project-limit-order-api]].
 */
export interface LimitOrderRoutesRequest {
  fromChainId: number
  fromAddress?: string
  fromTokenAddress: string
  fromAmount: string
  toChainId: number
  toAddress?: string
  toTokenAddress: string
  /** Expected receive amount — sets the limit price. */
  toAmount: string
  /** Unix timestamp (in seconds) until which the order should be valid. */
  validUntil: number
  /** Allow partial fills. */
  partiallyFillable?: boolean
  options?: LimitOrderRouteOptions
}

export interface LimitOrderRouteOptions {
  /** Which limit-order protocols to use. */
  exchanges?: {
    /** Allowed protocols (default: all). */
    allow?: string[]
    /** Denied protocols (default: none). */
    deny?: string[]
    /** Preferred protocols — use if available, fall back to others. */
    prefer?: string[]
  }
}

/**
 * Response from `advanced/routes`. `OrderRoute` is LiFi `Route`-shaped (so the
 * existing execution flow can consume it), with the order's `validUntil` /
 * `partiallyFillable` carried inside each step's action.
 */
export interface LimitOrderRoutesResponse {
  routes: Route[]
  unavailableRoutes?: unknown
}
