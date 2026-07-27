---
'@lifi/widget': patch
'@lifi/wallet-management': patch
'@lifi/widget-checkout': patch
'@lifi/widget-provider': patch
'@lifi/widget-provider-bitcoin': patch
'@lifi/widget-provider-ethereum': patch
'@lifi/widget-provider-solana': patch
'@lifi/widget-provider-sui': patch
'@lifi/widget-provider-tron': patch
---

chore: bump `@lifi/sdk` to `^4.3.0` and align duplicate-prone ranges

Move every package and example to `@lifi/sdk@^4.3.0` and refresh the
`@lifi/sdk-provider-*` ranges. `viem` and `@reown/appkit` ranges now match the
`pnpm-workspace.yaml` overrides (`>=2.52.0` / `>=1.8.20`) so consumers resolve a single
copy instead of a second one pulled in by a tighter caret range.
