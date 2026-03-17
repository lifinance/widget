import type {
  TransakCryptoCurrenciesResponse,
  TransakCryptoCurrency,
  TransakRefreshTokenResponse,
  TransakSessionResponse,
} from './types.js'

const PARTNER_API_BASE =
  process.env.TRANSAK_PARTNER_API_BASE?.trim() || 'https://api-stg.transak.com'
const API_GATEWAY_BASE =
  process.env.TRANSAK_API_GATEWAY_BASE?.trim() ||
  'https://api-gateway-stg.transak.com'

export class TransakHttpError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.name = 'TransakHttpError'
    this.status = status
  }
}

let cachedToken: { accessToken: string; expiresAt: number } | null = null
let pendingRefresh: Promise<string> | null = null

export function clearCachedToken(): void {
  cachedToken = null
}

export async function refreshPartnerToken(
  apiKey: string,
  apiSecret: string
): Promise<string> {
  const res = await fetch(`${PARTNER_API_BASE}/partners/api/v2/refresh-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ apiKey, apiSecret }),
  })

  if (!res.ok) {
    throw new TransakHttpError(
      `Failed to refresh Transak token: ${res.status}`,
      res.status
    )
  }

  const json = (await res.json()) as TransakRefreshTokenResponse
  const { accessToken, expiresAt } = json.data

  const expiresAtMs = new Date(expiresAt).getTime()
  if (Number.isNaN(expiresAtMs)) {
    throw new TransakHttpError(
      `Invalid expiresAt value from Transak: ${expiresAt}`,
      500
    )
  }

  cachedToken = {
    accessToken,
    expiresAt: expiresAtMs,
  }

  return accessToken
}

export async function getAccessToken(
  apiKey: string,
  apiSecret: string
): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt - 60_000) {
    return cachedToken.accessToken
  }
  if (pendingRefresh) {
    return pendingRefresh
  }
  pendingRefresh = refreshPartnerToken(apiKey, apiSecret).finally(() => {
    pendingRefresh = null
  })
  return pendingRefresh
}

export async function createSession(
  accessToken: string,
  widgetParams: Record<string, string | boolean>
): Promise<{ widgetUrl: string }> {
  const res = await fetch(`${PARTNER_API_BASE}/api/v2/auth/session`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ widgetParams }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new TransakHttpError(
      `Failed to create Transak session: ${res.status} ${text}`,
      res.status
    )
  }

  const json = (await res.json()) as TransakSessionResponse
  return { widgetUrl: json.data.widgetUrl }
}

export async function fetchCryptoCurrencies(): Promise<
  TransakCryptoCurrency[]
> {
  const res = await fetch(
    `${API_GATEWAY_BASE}/cryptocoverage/api/v1/public/crypto-currencies`
  )

  if (!res.ok) {
    const text = await res.text()
    throw new TransakHttpError(
      `Failed to fetch Transak crypto currencies: ${res.status} ${text}`,
      res.status
    )
  }

  const json = (await res.json()) as TransakCryptoCurrenciesResponse
  return json.response
}
