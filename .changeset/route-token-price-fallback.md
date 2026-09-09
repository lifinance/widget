---
'@lifi/widget': patch
---

fix(widget): value a route's tokens with the route's own price

`Token` falls back to the cached token whenever a token has no `logoURI`, and
that fallback merged the cached token *over* the route token — so the cached
`priceUSD` replaced the route's. The receive card reads the route price
directly, so the same output amount could show two different USD values on the
receive card and on the quote card. Thin or newly listed tokens are the ones
affected: they are the tokens without a logo, and their feed price drifts
furthest from the route price.

The fallback now fills only the gaps the route leaves, so a known route price
always wins. An unknown price arrives as `'0'` or `''` rather than as an absent
key, and those still fall back to the cache. `updateTokenInCache` also compares
addresses case-insensitively, so a casing difference between the token list and
the route no longer silently skips the token-list update.
