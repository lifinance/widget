---
'@lifi/widget-provider-ethereum': patch
'@lifi/widget-provider-tron': patch
---

Harden Tron WalletConnect against the EVM connector sharing the same project id.

- Force `customStoragePrefix: 'evm'` on the EVM WalletConnect connector. The Tron wrapper drops the prefix it is given, so both cores wrote identical `wc@2:…//session` keys and last-writer-wins clobbered the other ecosystem's session (a connected wallet vanished, refresh re-opened the QR). Isolating the EVM side fixes the collision regardless of the wrapper.
- Reject non-Tron addresses at the Tron provider boundary. The wrapper returns `accounts[0]` across all session namespaces, so scanning with an EVM wallet surfaced an `eip155` `0x…` address as the Tron account and let it flow into the route request as the Tron sender. Connected Tron accounts whose address isn't a valid base58 `T…` are now ignored, and the offending adapter is disconnected.
