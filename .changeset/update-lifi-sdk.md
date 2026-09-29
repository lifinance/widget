---
'@lifi/wallet-management': patch
'@lifi/widget': patch
'@lifi/widget-checkout': patch
'@lifi/widget-provider': patch
'@lifi/widget-provider-bitcoin': patch
'@lifi/widget-provider-ethereum': patch
'@lifi/widget-provider-solana': patch
'@lifi/widget-provider-stellar': patch
'@lifi/widget-provider-sui': patch
'@lifi/widget-provider-tron': patch
---

Update `@lifi/sdk` to 4.10.0 and the chain providers together: `@lifi/sdk-provider-bitcoin` 4.0.15, `@lifi/sdk-provider-ethereum` 4.2.4, `@lifi/sdk-provider-solana` 4.3.1, `@lifi/sdk-provider-stellar` 4.3.5, `@lifi/sdk-provider-sui` 4.2.5 and `@lifi/sdk-provider-tron` 4.1.5. Concurrent `getChains` and `getTokens` calls from clients on different API bases no longer share one response, and a caller that aborts a shared request no longer fails the others. `WidgetConfig.sdkConfig.rpcUrls` also accepts per-role lists (`{ read, write, bundle }`); the Solana provider sends transactions and Jito bundles through them. A rejected Solana signature shows as `SignatureRejected` instead of `UnknownError`.
