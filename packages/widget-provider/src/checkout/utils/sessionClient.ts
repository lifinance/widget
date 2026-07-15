import type { CheckoutSessionApiError } from '../api.js'

export interface CheckoutSessionRequestArgs<TBody> {
  baseUrl: string
  endpointPath:
    | '/v1/checkout/onramp/session'
    | '/v1/checkout/cex/session'
    | '/v1/checkout/onramp/fiat-currencies'
    | '/v1/checkout/onramp/quote'
  apiKey: string
  integrator?: string
  body: TBody
}

export type CheckoutSessionRequestResult<TData> =
  | { ok: true; data: TData }
  | { ok: false; status: number; apiError: CheckoutSessionApiError | null }

function parseSessionApiError(data: unknown): CheckoutSessionApiError | null {
  if (data == null || typeof data !== 'object') {
    return null
  }
  const candidate = data as Record<string, unknown>
  const error =
    typeof candidate.error === 'string' ? candidate.error : undefined
  const code = typeof candidate.code === 'string' ? candidate.code : undefined
  if (error === undefined && code === undefined) {
    return null
  }
  return { error, code }
}

/**
 * `endpointPath` already includes `/v1/...`, so a `baseUrl` that itself
 * ends in `/v1` would otherwise produce a doubled `/v1/v1/...`. Strip the
 * trailing `/v1` (and any trailing slashes) so both forms work.
 */
function normalizeSessionApiBaseUrl(baseUrl: string): string {
  const trimmed = baseUrl.replace(/\/+$/, '')
  if (trimmed.endsWith('/v1')) {
    return trimmed.slice(0, -3)
  }
  return trimmed
}

export async function postCheckoutSession<TBody, TData>({
  baseUrl,
  endpointPath,
  apiKey,
  integrator,
  body,
}: CheckoutSessionRequestArgs<TBody>): Promise<
  CheckoutSessionRequestResult<TData>
> {
  const normalizedBaseUrl = normalizeSessionApiBaseUrl(baseUrl)
  const res = await fetch(`${normalizedBaseUrl}${endpointPath}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-lifi-api-key': apiKey,
      ...(integrator ? { 'x-lifi-integrator': integrator } : {}),
    },
    body: JSON.stringify(body),
  })

  const data: unknown = await res.json().catch(() => null)
  if (!res.ok) {
    return {
      ok: false,
      status: res.status,
      apiError: parseSessionApiError(data),
    }
  }

  // A 2xx with a non-object body (empty body, HTML from a misconfigured
  // proxy, JSON `null`) would otherwise be cast straight to `TData` and
  // propagate as a structurally-invalid success. Treat it as a failure with
  // no parseable api error.
  if (data == null || typeof data !== 'object') {
    return { ok: false, status: res.status, apiError: null }
  }

  return {
    ok: true,
    data: data as TData,
  }
}
