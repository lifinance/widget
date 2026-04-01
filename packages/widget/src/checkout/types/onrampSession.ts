/** Body for `POST /v1/path/onramp-session` (mock API and Core-aligned). */
export interface OnrampSessionRequest {
  walletAddress: string
  tokenAddress: string
  chainId: number
  integrator: string
}

export interface OnrampSessionResponse {
  widgetUrl: string
}

/** Body for `POST /v1/path/cex-session` (Mesh CEX funding). */
export interface CexSessionRequest {
  userId: string
  transactionId: string
  integrator: string
  toAddress: {
    address: string
    tokenAddress: string
    chainId: number
    symbol: string
    networkId: string
  }
}

export interface CexSessionResponse {
  linkToken: string
}
