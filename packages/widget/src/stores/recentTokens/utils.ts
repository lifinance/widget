import type { TokenAmount } from '../../types/token.js'
import type { RecentToken } from './types.js'

export const getTokenKey = (chainId: number, address: string): string =>
  `${chainId}-${address.toLowerCase()}`

// No price, and no verdict but a flag: a stale "verified" would hide a warning.
export const toRecentToken = (token: TokenAmount): RecentToken => ({
  chainId: token.chainId,
  // Keep the casing: the form and the selected check compare it exactly.
  address: token.address,
  symbol: token.symbol,
  name: token.name,
  decimals: token.decimals,
  logoURI: token.logoURI,
  native: token.native,
  flagged: token.verificationStatus === 'flagged' || undefined,
})
