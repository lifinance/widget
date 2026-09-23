---
'@lifi/widget': minor
'@lifi/widget-provider': minor
'@lifi/widget-checkout': patch
'@lifi/wallet-management': patch
'@lifi/widget-provider-bitcoin': patch
'@lifi/widget-provider-ethereum': patch
'@lifi/widget-provider-solana': patch
'@lifi/widget-provider-stellar': patch
'@lifi/widget-provider-sui': patch
'@lifi/widget-provider-tron': patch
---

ZEC is a destination-only chain. It never appears as a source chain or source token, and a `fromChain` of ZEC from the widget config or the URL is ignored. A ZEC receiver must be a transparent Zcash address (`t1…` or `t3…`); shielded, unified and TEX addresses get a message that names the accepted formats.

Receivers are now checked against the destination chain, not only its chain type, so a Bitcoin address no longer passes as a ZEC receiver. A connected Bitcoin wallet is never filled in, offered, seeded or priced as a ZEC receiver, and a BTC → ZEC route asks for a receiver. Bookmarks of other ecosystems still save as before, and a Zcash bookmark shows the Zcash icon.

`@lifi/widget-provider` exports `useAddressForChain`, which returns `isAddressForChain(address, chain)` and `hasProviderFor(chainType)`, and the `ChainRef` and `IsAddressForChain` types. Every package that depends on the SDK requires the release whose `isAddress` accepts a chain ID, so a consumer keeps a single `@lifi/sdk`. `name` and `version` exported from `@lifi/widget` stay the widget's own now that `@lifi/sdk` exports the same names.
