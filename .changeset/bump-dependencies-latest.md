---
'@lifi/widget': patch
'@lifi/wallet-management': patch
'@lifi/widget-checkout': patch
'@lifi/widget-light': patch
'@lifi/widget-provider-bitcoin': patch
'@lifi/widget-provider-ethereum': patch
'@lifi/widget-provider-sui': patch
'@lifi/widget-provider-mesh': patch
---

chore: bump dependencies to their latest versions

Upgrade to TypeScript 7 and refresh runtime dependency ranges: `viem`, `@bigmi/*`, `i18next`, `react-i18next`, `react-intersection-observer`, `@mysten/sui`, `@meshconnect/web-link-sdk`, and the `@lifi/sdk-provider-*` packages. Aligns the `@bigmi/react` range across `@lifi/widget-provider-bitcoin` and `@lifi/widget-light` so a single `@bigmi/client` copy is resolved.
