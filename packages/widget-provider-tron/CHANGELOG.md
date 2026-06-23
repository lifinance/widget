# @lifi/widget-provider-tron

## 4.1.0

### Minor Changes

- [#796](https://github.com/lifinance/widget/pull/796) [`80c1387`](https://github.com/lifinance/widget/commit/80c13872909381a614bbca3669b37ee2e09b4902) Thanks [@chybisov](https://github.com/chybisov)! - Drop React 18 support and require React 19+. The `react`/`react-dom` peer dependency range is narrowed from `>=18` to `>=19`, and the components are modernized to React 19 idioms (refs passed as props instead of `forwardRef`, `use()` for context). The `widget-provider-*` packages now use React-19-only APIs and declare a `react: >=19` peer dependency. Integrators must be on React 19 or newer.

- [#780](https://github.com/lifinance/widget/pull/780) [`a242682`](https://github.com/lifinance/widget/commit/a242682b074ed8f97a55b01dd1bc01f9d79220bc) Thanks [@tomiiide](https://github.com/tomiiide)! - Re-enable WalletConnect for Tron. `createTronAdapters` accepts a `WalletConnectAdapterConfig`, and `TronProviderConfig.walletConnect` controls whether the adapter is registered: `true` uses the shipped defaults (mirroring the EVM provider), a config object is merged over them, `false`/undefined disables it.

  The resolver always forces `options.customStoragePrefix` to `'tron'` to isolate the Tron WalletConnect storage from the EVM connector's (same project id, same origin). Without it the EVM `eip155` namespaces bleed into the Tron session proposal and wallets connect as EVM, producing "No accounts found in session".

  `createTronAdapters` now takes an optional `WalletConnectAdapterConfig` argument. The change is backwards-compatible — existing callers keep the previous behaviour (WalletConnect adapter not registered).

### Patch Changes

- [#798](https://github.com/lifinance/widget/pull/798) [`873fd1e`](https://github.com/lifinance/widget/commit/873fd1eb0561415d0bcd51d42f3a292eb5ad2483) Thanks [@chybisov](https://github.com/chybisov)! - Update third-party runtime dependencies to their latest compatible versions (MUI 9.1, wagmi 3.6.17, viem ^2.52.2, TanStack Router/Virtual, i18next 26.3.1, and Tron/Sui/Solana wallet adapters).

- [#795](https://github.com/lifinance/widget/pull/795) [`900dc78`](https://github.com/lifinance/widget/commit/900dc78f1533c291ac08820753d8fe72779ff0e6) Thanks [@effie-ms](https://github.com/effie-ms)! - Remove the Ledger adapter from the Tron wallet adapters.

- [#780](https://github.com/lifinance/widget/pull/780) [`a242682`](https://github.com/lifinance/widget/commit/a242682b074ed8f97a55b01dd1bc01f9d79220bc) Thanks [@tomiiide](https://github.com/tomiiide)! - Harden Tron WalletConnect against the EVM connector sharing the same project id.

  - Force `customStoragePrefix: 'evm'` on the EVM WalletConnect connector. The Tron wrapper drops the prefix it is given, so both cores wrote identical `wc@2:…//session` keys and last-writer-wins clobbered the other ecosystem's session (a connected wallet vanished, refresh re-opened the QR). Isolating the EVM side fixes the collision regardless of the wrapper.
  - Reject non-Tron addresses at the Tron provider boundary. The wrapper returns `accounts[0]` across all session namespaces, so scanning with an EVM wallet surfaced an `eip155` `0x…` address as the Tron account and let it flow into the route request as the Tron sender. Connected Tron accounts whose address isn't a valid base58 `T…` are now ignored, and the offending adapter is disconnected.

- Updated dependencies [[`80c1387`](https://github.com/lifinance/widget/commit/80c13872909381a614bbca3669b37ee2e09b4902)]:
  - @lifi/widget-provider@4.1.0

## 4.0.0

### Patch Changes

- [#757](https://github.com/lifinance/widget/pull/757) [`168e0df`](https://github.com/lifinance/widget/commit/168e0df2f7bfd732dafe8c42cb73ee9988887a4c) Thanks [@chybisov](https://github.com/chybisov)! - Bump dependencies and raise the `wagmi` / `@wagmi/core` / `viem` peer ranges.

  `@lifi/widget-provider-ethereum` and `@lifi/widget-light` now require `wagmi@^3.6.16` and `@wagmi/core@^3.5.0` (plus `viem@^2.52.0` for `widget-light`). This pulls in `@wagmi/connectors@8.0.15`, whose `metaMask` connector answers pre-connect probe methods (`getProvider`/`isAuthorized`/`getAccounts`/`getChainId`) from the injected EIP-6963 provider when present — so registering the MetaMask SDK connector no longer downloads `@metamask/connect-evm` on page load for users with the extension installed.

- Updated dependencies []:
  - @lifi/widget-provider@4.0.0
