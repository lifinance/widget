---
'@lifi/widget': patch
'@lifi/widget-provider': minor
---

Token search: a pasted contract address now matches only the token at that address, so impersonators that embed a real address in their name or symbol no longer appear. A query with surrounding whitespace resolves as well, instead of returning nothing — that held for an address and now holds for a name or symbol too.

`useChainTypeFromAddress` also returns `getChainTypeFromTokenAddress`, which asks each configured provider's `SDKProvider.isTokenAddress`. A token identifier is not always shaped like a wallet address — Stellar tokens are `C…` contract ids and Sui tokens are `0x…::module::TYPE` coin types — so the widget no longer carries its own patterns for them. Bitcoin implements no token check, because the token list names its native coin `bitcoin`, so a `bitcoin` query stays a name search.
