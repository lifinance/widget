import type {
  TransakCryptoCurrenciesResponse,
  TransakCryptoCurrency,
  TransakRefreshTokenResponse,
  TransakSessionResponse,
} from './types'

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
  const url = `${PARTNER_API_BASE}/partners/api/v2/refresh-token`
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-secret': apiSecret,
    },
    body: JSON.stringify({ apiKey }),
  })

  if (!res.ok) {
    const text = await res.text()
    console.error(`[Transak] Token refresh failed:`, {
      url,
      status: res.status,
      response: text,
      apiKeyPrefix: `${apiKey?.slice(0, 8)}...`,
    })
    throw new TransakHttpError(
      `Failed to refresh Transak token: ${res.status} - ${text}`,
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
  const url = `${API_GATEWAY_BASE}/api/v2/auth/session`
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'access-token': accessToken,
    },
    body: JSON.stringify({ widgetParams }),
  })

  if (!res.ok) {
    const text = await res.text()
    console.error(`[Transak] Session creation failed:`, {
      url,
      status: res.status,
      response: text,
      accessTokenPrefix: `${accessToken?.slice(0, 20)}...`,
      widgetParams,
    })
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
