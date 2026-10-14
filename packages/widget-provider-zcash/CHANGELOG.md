# @lifi/widget-provider-zcash

## 4.0.2

### Patch Changes

- [#909](https://github.com/lifinance/widget/pull/909) [`ba24a56`](https://github.com/lifinance/widget/commit/ba24a564b803b4960bf22529d1cb72bb2d35ecbd) Thanks [@chybisov](https://github.com/chybisov)! - Update `@lifi/sdk` to 4.12.1. `fetchTxErrorDetails` now checks the transaction hash and the chain ID before it sends a request to Tenderly.

- [#909](https://github.com/lifinance/widget/pull/909) [`ba24a56`](https://github.com/lifinance/widget/commit/ba24a564b803b4960bf22529d1cb72bb2d35ecbd) Thanks [@chybisov](https://github.com/chybisov)! - Update the LI.FI SDK providers to latest: `@lifi/sdk-provider-bitcoin` 4.1.2, `@lifi/sdk-provider-ethereum` 4.2.9, `@lifi/sdk-provider-solana` 4.3.6, `@lifi/sdk-provider-stellar` 4.3.10, `@lifi/sdk-provider-sui` 4.2.10, `@lifi/sdk-provider-tron` 4.1.9 and `@lifi/sdk-provider-zcash` 4.0.2. The Solana provider now confirms a Jito bundle by the signatures of its transactions, not by the `sendBundle` answer.
- Updated dependencies [[`ba24a56`](https://github.com/lifinance/widget/commit/ba24a564b803b4960bf22529d1cb72bb2d35ecbd)]:
  - @lifi/widget-provider@4.6.2

## 4.0.1

### Patch Changes

- [#903](https://github.com/lifinance/widget/pull/903) [`4458495`](https://github.com/lifinance/widget/commit/4458495061371d770ba48ff856cb0feecf0c6357) Thanks [@chybisov](https://github.com/chybisov)! - Update `@lifi/sdk` to 4.12.0 and the LI.FI SDK providers to latest: `@lifi/sdk-provider-bitcoin` 4.1.1, `@lifi/sdk-provider-ethereum` 4.2.8, `@lifi/sdk-provider-solana` 4.3.5, `@lifi/sdk-provider-stellar` 4.3.9, `@lifi/sdk-provider-sui` 4.2.9, `@lifi/sdk-provider-tron` 4.1.8 and `@lifi/sdk-provider-zcash` 4.0.1. After a user rejects a batched swap in MetaMask, "Try again" asks for a new signature again.
- Updated dependencies [[`4458495`](https://github.com/lifinance/widget/commit/4458495061371d770ba48ff856cb0feecf0c6357)]:
  - @lifi/widget-provider@4.6.1

## 4.0.0

### Minor Changes

- [#884](https://github.com/lifinance/widget/pull/884) [`97e59c5`](https://github.com/lifinance/widget/commit/97e59c58c719805198e030a14fbe72fabde010c8) Thanks [@chybisov](https://github.com/chybisov)! - New package `@lifi/widget-provider-zcash`. Add `ZcashProvider()` to `providers` to offer ZEC as a destination; without it the widget shows no ZEC, because no ZEC receiver could be validated. With external wallet management the widget ignores `providers`, so render the component that `ZcashProvider()` returns around the widget, next to the other ecosystem providers. `@lifi/widget-provider` exports `ZcashContext` and `useZcashContext`, asks the provider that serves a chain for receiver checks, and recognises a Zcash address without a chain, so a Zcash bookmark keeps the Zcash icon.

### Patch Changes

- Updated dependencies [[`10d954a`](https://github.com/lifinance/widget/commit/10d954aaa9d4cc125c08045c0dd872d2549ec753), [`97e59c5`](https://github.com/lifinance/widget/commit/97e59c58c719805198e030a14fbe72fabde010c8), [`97e59c5`](https://github.com/lifinance/widget/commit/97e59c58c719805198e030a14fbe72fabde010c8)]:
  - @lifi/widget-provider@4.6.0
