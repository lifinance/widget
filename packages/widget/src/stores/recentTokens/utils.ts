import type { TokenAmount } from '../../types/token.js'
import type { RecentToken } from './types.js'

// A price or a verification verdict must never be persisted: a stale
// "verified" would suppress a real warning.
export const toRecentToken = (token: TokenAmount): RecentToken => ({
  chainId: token.chainId,
  address: token.address.toLowerCase(),
  symbol: token.symbol,
  name: token.name,
  decimals: token.decimals,
  logoURI: token.logoURI,
  native: token.native,
})
