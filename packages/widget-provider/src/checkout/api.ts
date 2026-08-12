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
