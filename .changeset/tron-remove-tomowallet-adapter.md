---
'@lifi/widget-provider-tron': patch
---

fix: remove `TomoWalletAdapter` import to fix build with `@tronweb3/tronwallet-adapters@1.3.1`

`@tronweb3/tronwallet-adapters@1.3.1` removed the `TomoWalletAdapter` export (TomoWallet login is no longer available). Since the package range was `^1.3.0`, consumers resolving `1.3.1` hit a `[MISSING_EXPORT] "TomoWalletAdapter" is not exported` failure during bundler static analysis. Removed the unconditional Tomo adapter import/instantiation and bumped the dependency range to `^1.3.1`.
