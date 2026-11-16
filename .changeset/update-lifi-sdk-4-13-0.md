---
"@lifi/wallet-management": patch
"@lifi/widget": patch
"@lifi/widget-checkout": patch
"@lifi/widget-provider": patch
"@lifi/widget-provider-bitcoin": patch
"@lifi/widget-provider-ethereum": patch
"@lifi/widget-provider-solana": patch
"@lifi/widget-provider-stellar": patch
"@lifi/widget-provider-sui": patch
"@lifi/widget-provider-tron": patch
"@lifi/widget-provider-zcash": patch
---

Update `@lifi/sdk` to 4.13.0 and `@lifi/sdk-provider-ethereum` to 4.3.0. These releases add the new gasless flow. Update the other `@lifi/sdk-provider-*` packages to the releases that use `@lifi/sdk` 4.13.0, so that the app keeps one copy of the SDK.

`@lifi/sdk` 4.13.0 uses `@lifi/types` 19. This version removes the deprecated chains Moonbeam, Boba, BOB, opBNB, Lens, Blast, Fusion, Gravity and Lisk from `ChainId` and `ChainKey`, and their coin keys from `CoinKey`. `@lifi/widget` re-exports `ChainId` and `CoinKey`, so these members are no longer available from `@lifi/widget`.
