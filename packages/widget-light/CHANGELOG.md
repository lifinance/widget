# @lifi/widget-light

## 4.5.1

### Patch Changes

- [#896](https://github.com/lifinance/widget/pull/896) [`10d954a`](https://github.com/lifinance/widget/commit/10d954aaa9d4cc125c08045c0dd872d2549ec753) Thanks [@chybisov](https://github.com/chybisov)! - Raise the optional peer floors to the latest releases: `wagmi` 3.7.7, `@wagmi/core` 3.6.5, `@bigmi/client` 0.10.5, `@bigmi/react` 0.9.5, `@mysten/dapp-kit-react` 2.1.39 and `@wallet-standard/base` 1.1.1.

## 4.5.0

### Minor Changes

- [#891](https://github.com/lifinance/widget/pull/891) [`0b3811c`](https://github.com/lifinance/widget/commit/0b3811ce2492b385219659632fd157b3b4923c57) Thanks [@chybisov](https://github.com/chybisov)! - Split `keyPrefix` into `storageScopeKey` and `queryScopeKey`, and publish shared
  query options at `@lifi/widget/queries`.
  
  `keyPrefix` did two unrelated jobs: it named the widget's persisted stores in
  `localStorage`, which belong to one widget instance, and it prefixed every
  react-query key, which scopes data inside the host's `QueryClient`. One field
  cannot have both granularities, so a host app and the widget could never share
  server data such as chains and tools.
  
  - `storageScopeKey` namespaces persisted state — bookmarks, pinned tokens,
    recent tokens, chain order and route history, the stores `keyPrefix` named.
    Store names are unchanged, so moving a value from `keyPrefix` to
    `storageScopeKey` keeps every user's saved data. Settings keep their one
    shared name. It also scopes the widget's other queries.
  - `queryScopeKey` scopes the chains and tools queries. Instances and a host app
    that pass the same value share those entries.
  - `keyPrefix` is deprecated and stays the fallback for both: nothing changes for
    an integration that keeps using it. With neither set, the query scope defaults
    to `'li.fi'`.
  
  `@lifi/widget/queries` exports `getChainsQueryOptions` and
  `getToolsQueryOptions` (plus their key builders), following wagmi's
  `@wagmi/core/query` convention: keys are `['chains', { apiUrl, chainTypes,
  scopeKey }]` and `['tools', { apiUrl, scopeKey }]`, the `queryFn` reads its
  parameters from the key, and caller behaviour (`staleTime`, `select`, …) goes in
  `query` and never into the key. The subpath depends only on `@lifi/sdk` at
  runtime, so a host can import it without loading the widget.
  
  The widget's chains and tools queries now use these factories. Their cache
  entries hold the raw response; tools are narrowed per widget with `select`.
  The widget's internal query keys are not public API, but an integration that
  invalidated them by reconstructing the old `${keyPrefix}-widget-chains` string
  must switch to `getChainsQueryKey` / `getToolsQueryKey`.
  
  `@lifi/widget-checkout` names its bookmarks store from the same storage scope,
  and `@lifi/widget-light` accepts `storageScopeKey`.

## 4.4.0

### Minor Changes

- [#878](https://github.com/lifinance/widget/pull/878) [`e9c695f`](https://github.com/lifinance/widget/commit/e9c695f9981d60bd23cff85d2c3324a739ebf0d7) Thanks [@chybisov](https://github.com/chybisov)! - Require `@bigmi/client` 0.10.4, `@bigmi/core` 0.9.2 and `@bigmi/react` 0.9.4. The client release detects BitKeep when it injects only as `window.unisat`, which connector-backed wallet detection needs in order not to narrow. The core release reports a declined confirmation as a user rejection even when the wallet sends no rejection code, so a cancelled MetaMask Bitcoin signature now reads "Signature required" instead of "Unknown Error". The 0.10.4 client additionally fixes Binance detection when `window.binancew3w` carries no bitcoin provider, stops MetaMask Bitcoin opening the extension on page load, and keeps the store consistent when a wallet's own `disconnect()` throws.

- [#881](https://github.com/lifinance/widget/pull/881) [`6ca0991`](https://github.com/lifinance/widget/commit/6ca09911a49dda74d9450fad4a0732be789dac40) Thanks [@chybisov](https://github.com/chybisov)! - Add `hiddenUI.recentSearches` to the config type, to hide the widget's Recent searches section.

## 4.3.2

### Patch Changes

- [#836](https://github.com/lifinance/widget/pull/836) [`676c5b4`](https://github.com/lifinance/widget/commit/676c5b4b0e763bb0c069f49ac6f5afeeacb5f617) Thanks [@chybisov](https://github.com/chybisov)! - chore: bump `@bigmi/client` to `^0.10.1` and `@bigmi/react` to `^0.9.1`

  Ranges stay aligned across `@lifi/widget-light` and `@lifi/widget-provider-bitcoin` so a single
  `@bigmi/client` copy is resolved. `@bigmi/core` is unchanged — `^0.9.0` is already the latest release.

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
