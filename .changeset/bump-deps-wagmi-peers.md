---
"@lifi/widget-provider-ethereum": minor
"@lifi/widget-light": minor
"@lifi/widget": patch
"@lifi/wallet-management": patch
"@lifi/widget-provider-sui": patch
"@lifi/widget-provider-solana": patch
"@lifi/widget-provider-tron": patch
---

Bump dependencies and raise the `wagmi` / `@wagmi/core` / `viem` peer ranges.

`@lifi/widget-provider-ethereum` and `@lifi/widget-light` now require `wagmi@^3.6.16` and `@wagmi/core@^3.5.0` (plus `viem@^2.52.0` for `widget-light`). This pulls in `@wagmi/connectors@8.0.15`, whose `metaMask` connector answers pre-connect probe methods (`getProvider`/`isAuthorized`/`getAccounts`/`getChainId`) from the injected EIP-6963 provider when present — so registering the MetaMask SDK connector no longer downloads `@metamask/connect-evm` on page load for users with the extension installed.
