import type { TokenAmount } from '../../types/token.js'
import type { RecentToken } from './types.js'

// A price or a verification verdict must never be persisted: a stale
// "verified" would suppress a real warning.
export const toRecentToken = (token: TokenAmount): RecentToken => ({
  chainId: token.chainId,
  // Kept in the token's own casing: it is written back into the form, and
  // `selected` and the same-token guard compare addresses case-sensitively.
  address: token.address,
  symbol: token.symbol,
  name: token.name,
  decimals: token.decimals,
  logoURI: token.logoURI,
  native: token.native,
})
