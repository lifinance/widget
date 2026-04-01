export type {
  OnrampSessionRequest,
  OnrampSessionResponse,
} from '../src/checkout/types/onrampSession.js'

export interface ErrorResponse {
  error: string
  code: string
}

export interface TransakCryptoCurrency {
  coinId: string
  symbol: string
  name: string
  address: string | null
  network: {
    name: string
    chainId: string | null
  } | null
  isAllowed: boolean
  uniqueId: string
}

export interface TransakCryptoCurrenciesResponse {
  response: TransakCryptoCurrency[]
}

export interface TransakRefreshTokenResponse {
  data: {
    accessToken: string
    expiresAt: string
  }
}

export interface TransakSessionResponse {
  data: {
    widgetUrl: string
    sessionId: string
  }
}
