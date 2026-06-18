---
'@lifi/widget-provider-tron': minor
---

Re-enable WalletConnect for Tron. `createTronAdapters` accepts a `WalletConnectAdapterConfig`, and `TronProviderConfig.walletConnect` controls whether the adapter is registered: `true` uses the shipped defaults (mirroring the EVM provider), a config object is merged over them, `false`/undefined disables it.

The resolver always forces `options.customStoragePrefix` to `'tron'` to isolate the Tron WalletConnect storage from the EVM connector's (same project id, same origin). Without it the EVM `eip155` namespaces bleed into the Tron session proposal and wallets connect as EVM, producing "No accounts found in session".

`createTronAdapters` now takes an optional `WalletConnectAdapterConfig` argument. The change is backwards-compatible — existing callers keep the previous behaviour (WalletConnect adapter not registered).
