---
'@lifi/widget': patch
---

fix(widget): keep a known token price when a route cannot price it

A route that returns `priceUSD` `"0"` for its output token blanked the value on
every quote card. `useRoutes` writes the route's tokens back into the token
caches through `updateTokenInCache`, which spread that `"0"` over the price the
cache already held. `Token`'s logo fallback then looked for a cached price to
fall back to and found the same `"0"`, so the guard added in #866 had nothing
left to read.

`knownPriceUSD` now applies the rule where the value is written as well as where
it is read: an incoming `'0'` or `''` never replaces a price the cache knows,
and an empty `logoURI` no longer clears a cached logo.
