---
'@lifi/widget-provider': minor
'@lifi/widget-provider-bitcoin': minor
---

Bitcoin wallets are now listed only when their connector can actually resolve a provider, instead of being detected by a second copy of that logic that had drifted from it. A wallet that impersonates MetaMask no longer offers a Bitcoin entry that cannot connect.

`isWalletInstalled` no longer answers for Bitcoin connector ids and returns `true` for them, as it does for any wallet it does not explicitly know. `metaMask` and `coinbase` are unchanged.
