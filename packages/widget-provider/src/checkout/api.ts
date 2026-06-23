/** Body for `POST /v1/checkout/onramp/session`. */
export interface OnrampSessionRequest {
  depositAddress: string
  tokenAddress: string
  chainId: number
  integrator: string
  amount?: string
  fiatCurrency?: string
  fiatAmount?: string
  paymentMethod?: string
  countryCode?: string
}

export interface OnrampSessionResponse {
  widgetUrl: string
  fundingSessionId?: string
}

export interface OnrampFiatCurrenciesRequest {
  tokenAddress: string
  chainId: number
  countryCode?: string
}

export interface OnrampPaymentOption {
  id: string
  name?: string
}

export interface OnrampFiatCurrency {
  currency: string
  paymentOptions: OnrampPaymentOption[]
}

export interface OnrampFiatCurrenciesResponse {
  defaultCurrency?: string
  currencies: OnrampFiatCurrency[]
}

export interface OnrampQuoteRequest {
  tokenAddress: string
  chainId: number
  fiatCurrency: string
  fiatAmount: string
  paymentMethod?: string
  countryCode?: string
}

export interface OnrampQuoteFee {
  name?: string
  label?: string
  type?: string
  amount: string
}

export interface OnrampQuoteResponse {
  fiat: { amount: string; currency: string }
  funding: { estimatedAmount: string; symbol: string; decimals: number }
  fees: {
    currency: string
    total: { amount: string }
    breakdown?: OnrampQuoteFee[]
  }
  warnings?: string[]
  paymentMethod?: string
  provider: 'TRANSAK'
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
