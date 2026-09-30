---
'@lifi/widget-provider-zcash': minor
'@lifi/widget-provider': minor
'@lifi/widget': minor
---

New package `@lifi/widget-provider-zcash`. Add `ZcashProvider()` to `providers` to offer ZEC as a destination; without it the widget shows no ZEC, because no ZEC receiver could be validated. With external wallet management the widget ignores `providers`, so render the component that `ZcashProvider()` returns around the widget, next to the other ecosystem providers. `@lifi/widget-provider` exports `ZcashContext` and `useZcashContext`, asks the provider that serves a chain for receiver checks, and recognises a Zcash address without a chain, so a Zcash bookmark keeps the Zcash icon.
