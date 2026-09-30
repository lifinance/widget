---
'@lifi/widget-provider-zcash': minor
'@lifi/widget-provider': minor
'@lifi/widget': minor
---

New package `@lifi/widget-provider-zcash`. Add `ZcashProvider()` to `providers` to offer ZEC as a destination; without it the widget shows no ZEC, because no ZEC receiver could be validated. `@lifi/widget-provider` exports `ZcashContext` and `useZcashContext`, asks the provider that serves a chain for receiver checks, and recognises a Zcash address without a chain, so a Zcash bookmark keeps the Zcash icon.
