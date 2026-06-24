import type {
  LimitOrderRoutesRequest,
  LimitOrderRoutesResponse,
} from './types.js'

/**
 * Base URL for Jumper's limit-order API. It mirrors `li.quest/advanced/*` and
 * extends `advanced/routes` with `toAmount` / `validUntil` / `partiallyFillable`.
 *
 * TODO(EMB-323): this is the develop environment. Move the base URL (and
 * integrator / apiKey headers) into widget/SDK config once the API is promoted
 * to a stable environment. The installed `@lifi/sdk@4.0.0` cannot carry the
 * limit fields or override the base URL per call, so limit routes are fetched
 * via this dedicated client rather than `getRoutes`. See [[project-limit-order-api]].
 */
const LIMIT_ORDER_API_URL = 'https://api-limit-order-develop.jumper.xyz'

/**
 * Fetch available limit-order routes. NOT yet wired into `useRoutes` — enabling
 * it is gated on the API reaching a stable environment (EMB-323).
 */
export async function getLimitOrderRoutes(
  request: LimitOrderRoutesRequest,
  options?: { signal?: AbortSignal }
): Promise<LimitOrderRoutesResponse> {
  const response = await fetch(`${LIMIT_ORDER_API_URL}/advanced/routes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
    signal: options?.signal,
  })

  if (!response.ok) {
    throw new Error(`Limit order routes request failed: ${response.status}`)
  }

  return (await response.json()) as LimitOrderRoutesResponse
}

// TODO(EMB-323): remaining limit-order endpoints to implement for execution,
// all mirroring the LiFi flow against LIMIT_ORDER_API_URL:
//   - POST advanced/stepTransaction  → populate typedData / transactionRequest
//   - POST advanced/relay            → relay signed typedData, returns taskId
//   - POST relayer/status            → poll DONE | PENDING | FAILED (+ orderId)
// Execution otherwise reuses the existing widget flow (sign → relay → status).
