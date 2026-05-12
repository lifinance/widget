/** Body for `POST /v1/checkout/onramp/session`. */
export interface OnrampSessionRequest {
  walletAddress: string
  tokenAddress: string
  chainId: number
  integrator: string
  amount?: string
  fiatCurrency?: 'USD' | 'EUR' | 'GBP'
}

export interface OnrampSessionResponse {
  widgetUrl: string
}

/** Body for `POST /v1/checkout/cex/session` (Mesh CEX funding). */
export interface CexSessionRequest {
  walletAddress: string
  tokenAddress: string
  chainId: number
  userId?: string
  integrator?: string
  amount?: string
}

export interface CexSessionResponse {
  linkToken: string
}

/** Common non-2xx payload shape returned by checkout session APIs. */
export interface CheckoutSessionApiError {
  error?: string
  code?: string
}
