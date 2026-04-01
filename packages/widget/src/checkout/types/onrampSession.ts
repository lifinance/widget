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
