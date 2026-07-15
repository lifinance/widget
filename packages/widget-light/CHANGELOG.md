# @lifi/widget-light

## 4.3.1

### Patch Changes

- [#828](https://github.com/lifinance/widget/pull/828) [`1c6f5a2`](https://github.com/lifinance/widget/commit/1c6f5a235ec6347fd045c14d8cea4444c1e2eb84) Thanks [@chybisov](https://github.com/chybisov)! - chore: bump dependencies to their latest versions

  Upgrade to TypeScript 7 and refresh runtime dependency ranges: `viem`, `@bigmi/*`, `i18next`, `react-i18next`, `react-intersection-observer`, `@mysten/sui`, `@meshconnect/web-link-sdk`, and the `@lifi/sdk-provider-*` packages. Aligns the `@bigmi/react` range across `@lifi/widget-provider-bitcoin` and `@lifi/widget-light` so a single `@bigmi/client` copy is resolved.

## 4.3.0

### Minor Changes

- [#819](https://github.com/lifinance/widget/pull/819) [`fa7c7ab`](https://github.com/lifinance/widget/commit/fa7c7abf39579133defa8bc86dacf9d56aa2f085) Thanks [@chmanie](https://github.com/chmanie)! - Add `tokens.verified` config allowlist to mark specific tokens as trusted, suppressing the unverified token warning without adding them to the featured or popular categories. Tokens from `tokens.include` are now also marked as verified.

## 4.2.0

### Minor Changes

- [#778](https://github.com/lifinance/widget/pull/778) [`eb4268f`](https://github.com/lifinance/widget/commit/eb4268fcdfedec194a35121d525fb1f7262348f6) Thanks [@effie-ms](https://github.com/effie-ms)! - Add `AppearanceChanged` widget event emitted when the user toggles light/dark/system in the settings page.

## 4.1.0

### Minor Changes

- [#796](https://github.com/lifinance/widget/pull/796) [`80c1387`](https://github.com/lifinance/widget/commit/80c13872909381a614bbca3669b37ee2e09b4902) Thanks [@chybisov](https://github.com/chybisov)! - Drop React 18 support and require React 19+. The `react`/`react-dom` peer dependency range is narrowed from `>=18` to `>=19`, and the components are modernized to React 19 idioms (refs passed as props instead of `forwardRef`, `use()` for context). The `widget-provider-*` packages now use React-19-only APIs and declare a `react: >=19` peer dependency. Integrators must be on React 19 or newer.

### Patch Changes

- [#801](https://github.com/lifinance/widget/pull/801) [`e4cd0f2`](https://github.com/lifinance/widget/commit/e4cd0f265e72852e679b35fbff2eb4ddaaa794f6) Thanks [@chybisov](https://github.com/chybisov)! - Migrate the Sui integration to the gRPC client (`@mysten/sui/grpc`) ahead of Sui's JSON-RPC sunset. The iframe-embedded provider now creates a `SuiGrpcClient`, `@mysten/sui/jsonRpc` is no longer used anywhere in the widget, and the `@mysten/dapp-kit-react` peer dependency is bumped to `^2.1.3`.

## 4.0.0

### Minor Changes

- [#757](https://github.com/lifinance/widget/pull/757) [`168e0df`](https://github.com/lifinance/widget/commit/168e0df2f7bfd732dafe8c42cb73ee9988887a4c) Thanks [@chybisov](https://github.com/chybisov)! - Bump dependencies and raise the `wagmi` / `@wagmi/core` / `viem` peer ranges.

  `@lifi/widget-provider-ethereum` and `@lifi/widget-light` now require `wagmi@^3.6.16` and `@wagmi/core@^3.5.0` (plus `viem@^2.52.0` for `widget-light`). This pulls in `@wagmi/connectors@8.0.15`, whose `metaMask` connector answers pre-connect probe methods (`getProvider`/`isAuthorized`/`getAccounts`/`getChainId`) from the injected EIP-6963 provider when present — so registering the MetaMask SDK connector no longer downloads `@metamask/connect-evm` on page load for users with the extension installed.
