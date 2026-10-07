# @lifi/widget-provider-zcash

## 4.0.0

### Minor Changes

- [#884](https://github.com/lifinance/widget/pull/884) [`97e59c5`](https://github.com/lifinance/widget/commit/97e59c58c719805198e030a14fbe72fabde010c8) Thanks [@chybisov](https://github.com/chybisov)! - New package `@lifi/widget-provider-zcash`. Add `ZcashProvider()` to `providers` to offer ZEC as a destination; without it the widget shows no ZEC, because no ZEC receiver could be validated. With external wallet management the widget ignores `providers`, so render the component that `ZcashProvider()` returns around the widget, next to the other ecosystem providers. `@lifi/widget-provider` exports `ZcashContext` and `useZcashContext`, asks the provider that serves a chain for receiver checks, and recognises a Zcash address without a chain, so a Zcash bookmark keeps the Zcash icon.

### Patch Changes

- Updated dependencies [[`10d954a`](https://github.com/lifinance/widget/commit/10d954aaa9d4cc125c08045c0dd872d2549ec753), [`97e59c5`](https://github.com/lifinance/widget/commit/97e59c58c719805198e030a14fbe72fabde010c8), [`97e59c5`](https://github.com/lifinance/widget/commit/97e59c58c719805198e030a14fbe72fabde010c8)]:
  - @lifi/widget-provider@4.6.0
