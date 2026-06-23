# @lifi/widget-provider-sui

## 4.1.0

### Minor Changes

- [#796](https://github.com/lifinance/widget/pull/796) [`80c1387`](https://github.com/lifinance/widget/commit/80c13872909381a614bbca3669b37ee2e09b4902) Thanks [@chybisov](https://github.com/chybisov)! - Drop React 18 support and require React 19+. The `react`/`react-dom` peer dependency range is narrowed from `>=18` to `>=19`, and the components are modernized to React 19 idioms (refs passed as props instead of `forwardRef`, `use()` for context). The `widget-provider-*` packages now use React-19-only APIs and declare a `react: >=19` peer dependency. Integrators must be on React 19 or newer.

### Patch Changes

- [#798](https://github.com/lifinance/widget/pull/798) [`873fd1e`](https://github.com/lifinance/widget/commit/873fd1eb0561415d0bcd51d42f3a292eb5ad2483) Thanks [@chybisov](https://github.com/chybisov)! - Update third-party runtime dependencies to their latest compatible versions (MUI 9.1, wagmi 3.6.17, viem ^2.52.2, TanStack Router/Virtual, i18next 26.3.1, and Tron/Sui/Solana wallet adapters).

- [#802](https://github.com/lifinance/widget/pull/802) [`6ac5419`](https://github.com/lifinance/widget/commit/6ac541917d2caf4981aecc9622d5908b48f65696) Thanks [@chybisov](https://github.com/chybisov)! - Bump SDK provider dependencies to their latest compatible releases (`@lifi/sdk-provider-ethereum` 4.0.2, `@lifi/sdk-provider-sui` 4.1.0) and align the `viem` range with the workspace override.

- [#801](https://github.com/lifinance/widget/pull/801) [`e4cd0f2`](https://github.com/lifinance/widget/commit/e4cd0f265e72852e679b35fbff2eb4ddaaa794f6) Thanks [@chybisov](https://github.com/chybisov)! - Migrate the Sui integration to the gRPC client (`@mysten/sui/grpc`) ahead of Sui's JSON-RPC sunset. The iframe-embedded provider now creates a `SuiGrpcClient`, `@mysten/sui/jsonRpc` is no longer used anywhere in the widget, and the `@mysten/dapp-kit-react` peer dependency is bumped to `^2.1.3`.

- Updated dependencies [[`80c1387`](https://github.com/lifinance/widget/commit/80c13872909381a614bbca3669b37ee2e09b4902)]:
  - @lifi/widget-provider@4.1.0

## 4.0.0

### Patch Changes

- [#757](https://github.com/lifinance/widget/pull/757) [`168e0df`](https://github.com/lifinance/widget/commit/168e0df2f7bfd732dafe8c42cb73ee9988887a4c) Thanks [@chybisov](https://github.com/chybisov)! - Bump dependencies and raise the `wagmi` / `@wagmi/core` / `viem` peer ranges.

  `@lifi/widget-provider-ethereum` and `@lifi/widget-light` now require `wagmi@^3.6.16` and `@wagmi/core@^3.5.0` (plus `viem@^2.52.0` for `widget-light`). This pulls in `@wagmi/connectors@8.0.15`, whose `metaMask` connector answers pre-connect probe methods (`getProvider`/`isAuthorized`/`getAccounts`/`getChainId`) from the injected EIP-6963 provider when present — so registering the MetaMask SDK connector no longer downloads `@metamask/connect-evm` on page load for users with the extension installed.

- Updated dependencies []:
  - @lifi/widget-provider@4.0.0
