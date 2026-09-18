---
'@lifi/widget-provider-bitcoin': minor
'@lifi/wallet-management': patch
---

Offer MetaMask Bitcoin by default. `createDefaultBigmiConfig` now includes the `metamask()` connector alongside the other eleven, so integrators no longer opt in.

This adds no dependency. The connector reaches MetaMask through the Wallet Standard registry, which the extension populates itself, and it imports only `@bigmi/core` and `@wallet-standard/app` — both already present. The `@metamask/*` packages were needed solely for the manual registration this replaces, so dropping them makes the playground bundle ~31 KB smaller.
