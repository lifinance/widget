---
'@lifi/widget-provider-bitcoin': minor
'@lifi/wallet-management': patch
---

Offer MetaMask Bitcoin by default. `createDefaultBigmiConfig` now includes the `metamask()` connector alongside the other eleven, so integrators no longer opt in.

This adds no dependency. The connector reaches MetaMask through the Wallet Standard registry, which the extension populates itself, and it imports only `@bigmi/core` and `@wallet-standard/app` — both already present. `@metamask/bitcoin-wallet-standard` and `@metamask/multichain-api-client` existed solely for the manual registration this replaces and are gone; `@metamask/connect-evm` stays, because `wagmi`'s EVM `metaMask()` connector imports it dynamically. The playground bundle is ~41 KB smaller.
