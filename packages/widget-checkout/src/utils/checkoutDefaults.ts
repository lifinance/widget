/**
 * Cash and exchange deposits aren't wallet-funded, so the source is pinned to
 * USDC on Ethereum mainnet rather than inheriting the prior wallet/transfer
 * selection.
 *
 * ASSUMPTION: the integrator's config permits chain 1 and this token. If a
 * deny-list / allow-list excludes them, the seeded selection resolves to no
 * curated token and the quote on the select-token step comes back empty —
 * there is no automatic fallback to another permitted asset yet.
 */
export const DEFAULT_FROM_CHAIN_ID = 1
export const DEFAULT_FROM_TOKEN_ADDRESS =
  '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
