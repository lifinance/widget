import type { CheckoutSessionApiError } from '../api.js'

export interface CheckoutSessionRequestArgs<TBody> {
  baseUrl: string
  endpointPath: '/v1/checkout/onramp/session' | '/v1/checkout/cex/session'
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

function normalizeSessionApiBaseUrl(baseUrl: string): string {
  // TODO(cleanup-review-baseurl-v1-normalization-hack): Drop this compat shim
  // once all callers consistently provide base URLs without `/v1`.
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

  return {
    ok: true,
    data: data as TData,
  }
}
