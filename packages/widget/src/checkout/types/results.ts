export interface CheckoutResult {
  transactionHash?: string
  provider: string
  amount: string
  token: string
  chainId: number
}

export interface CheckoutError {
  code: string
  message: string
  provider?: string
}
