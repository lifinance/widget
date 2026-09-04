# @lifi/widget-provider-sui

## 4.1.4

### Patch Changes

- [#827](https://github.com/lifinance/widget/pull/827) [`1d7bf36`](https://github.com/lifinance/widget/commit/1d7bf36f298db238e0402871a82488078da4b917) Thanks [@chybisov](https://github.com/chybisov)! - Update `@lifi/sdk` to `^4.4.0` and each ecosystem SDK provider to its latest release.

- [#847](https://github.com/lifinance/widget/pull/847) [`874158c`](https://github.com/lifinance/widget/commit/874158c47bcc83eb6a12317a56e57b4b0c3d29e7) Thanks [@chybisov](https://github.com/chybisov)! - Update `@lifi/sdk` to `^4.6.0` and each `@lifi/sdk-provider-*` package to its latest release.

- [#857](https://github.com/lifinance/widget/pull/857) [`2b290ab`](https://github.com/lifinance/widget/commit/2b290abb0fe9adb1ac5c1f6eb6fbb55e158fadea) Thanks [@chybisov](https://github.com/chybisov)! - Update `@lifi/sdk` to `^4.6.1` and each `@lifi/sdk-provider-*` package to its latest
  release. Move `@creit.tech/stellar-wallets-kit` to `^2.6.0`, which requires
  `@stellar/stellar-sdk` v17. No source change was needed. The widget never imports
  `@stellar/stellar-sdk` directly, so the v17 renames and its switch from `Buffer` to
  `Uint8Array` have no surface here.
  
  If you pin `@creit.tech/stellar-wallets-kit` yourself, move to `^2.6.0`. The kit keeps
  wallet state in module level signals, so a second copy in the tree fails with "Please
  set the wallet first".
  
  `@mysten/sui` moves to `^2.27.0` because `@lifi/sdk-provider-sui@4.1.10` requires it. A
  lower range lets a fresh install resolve two copies, which breaks the Sui provider types.
  
  `@stellar/stellar-sdk` also drops from two copies to one. SWK `2.6.0` no longer pulls
  `@trezor/connect-plugin-stellar`, which removes the subtree that asked for `14.2.0`, and
  the remaining copy moves to `17.0.1`.

- [#864](https://github.com/lifinance/widget/pull/864) [`e3709d0`](https://github.com/lifinance/widget/commit/e3709d0fc4bc2b8e848b1792f8b6321a2956008f) Thanks [@chybisov](https://github.com/chybisov)! - Update the LI.FI SDK providers to latest: `@lifi/sdk-provider-ethereum` 4.0.14, `@lifi/sdk-provider-solana` 4.1.3, `@lifi/sdk-provider-stellar` 4.2.4 and `@lifi/sdk-provider-sui` 4.1.12.

- [#847](https://github.com/lifinance/widget/pull/847) [`874158c`](https://github.com/lifinance/widget/commit/874158c47bcc83eb6a12317a56e57b4b0c3d29e7) Thanks [@chybisov](https://github.com/chybisov)! - Update runtime dependencies, including `@lifi/sdk` 4.4.0 and the `@lifi/sdk-provider-*` packages.

- [#858](https://github.com/lifinance/widget/pull/858) [`a5997eb`](https://github.com/lifinance/widget/commit/a5997ebf00df18cfe105d8390a437d7d853d780d) Thanks [@chybisov](https://github.com/chybisov)! - Update `@mysten/sui` to 2.28.0.

- [#858](https://github.com/lifinance/widget/pull/858) [`a5997eb`](https://github.com/lifinance/widget/commit/a5997ebf00df18cfe105d8390a437d7d853d780d) Thanks [@chybisov](https://github.com/chybisov)! - Bump `@mysten/sui` to 2.27.1.
- Updated dependencies [[`1d7bf36`](https://github.com/lifinance/widget/commit/1d7bf36f298db238e0402871a82488078da4b917), [`874158c`](https://github.com/lifinance/widget/commit/874158c47bcc83eb6a12317a56e57b4b0c3d29e7), [`2b290ab`](https://github.com/lifinance/widget/commit/2b290abb0fe9adb1ac5c1f6eb6fbb55e158fadea), [`874158c`](https://github.com/lifinance/widget/commit/874158c47bcc83eb6a12317a56e57b4b0c3d29e7)]:
  - @lifi/widget-provider@4.4.0

## 4.1.3

### Patch Changes

- [#836](https://github.com/lifinance/widget/pull/836) [`676c5b4`](https://github.com/lifinance/widget/commit/676c5b4b0e763bb0c069f49ac6f5afeeacb5f617) Thanks [@chybisov](https://github.com/chybisov)! - chore: bump `@lifi/sdk` to `^4.3.0` and align duplicate-prone ranges

  Move every package and example to `@lifi/sdk@^4.3.0` and refresh the
  `@lifi/sdk-provider-*` ranges. `viem` and `@reown/appkit` ranges now match the
  `pnpm-workspace.yaml` overrides (`>=2.52.0` / `>=1.8.20`) so consumers resolve a single
  copy instead of a second one pulled in by a tighter caret range.

- Updated dependencies [[`676c5b4`](https://github.com/lifinance/widget/commit/676c5b4b0e763bb0c069f49ac6f5afeeacb5f617)]:
  - @lifi/widget-provider@4.3.1

## 4.1.2

### Patch Changes

- [#828](https://github.com/lifinance/widget/pull/828) [`1c6f5a2`](https://github.com/lifinance/widget/commit/1c6f5a235ec6347fd045c14d8cea4444c1e2eb84) Thanks [@chybisov](https://github.com/chybisov)! - chore: bump dependencies to their latest versions

  Upgrade to TypeScript 7 and refresh runtime dependency ranges: `viem`, `@bigmi/*`, `i18next`, `react-i18next`, `react-intersection-observer`, `@mysten/sui`, `@meshconnect/web-link-sdk`, and the `@lifi/sdk-provider-*` packages. Aligns the `@bigmi/react` range across `@lifi/widget-provider-bitcoin` and `@lifi/widget-light` so a single `@bigmi/client` copy is resolved.

- Updated dependencies [[`682e043`](https://github.com/lifinance/widget/commit/682e0430644efc6f4463cb5e016f7f2f21078220), [`682e043`](https://github.com/lifinance/widget/commit/682e0430644efc6f4463cb5e016f7f2f21078220), [`682e043`](https://github.com/lifinance/widget/commit/682e0430644efc6f4463cb5e016f7f2f21078220)]:
  - @lifi/widget-provider@4.3.0

## 4.1.1

### Patch Changes

- [#816](https://github.com/lifinance/widget/pull/816) [`5071e9e`](https://github.com/lifinance/widget/commit/5071e9e93febb833b7a5989ab30586d4dcf527d5) Thanks [@chybisov](https://github.com/chybisov)! - Bump dependencies (@lifi/sdk → 4.1.x, MUI, wagmi, vite, and others).

- Updated dependencies [[`5071e9e`](https://github.com/lifinance/widget/commit/5071e9e93febb833b7a5989ab30586d4dcf527d5), [`6d19d22`](https://github.com/lifinance/widget/commit/6d19d22f9ed796a0067cccb14885c15d0ca6061d), [`bf91f25`](https://github.com/lifinance/widget/commit/bf91f25149496c00e1e5635e6d65d848c49a56c9)]:
  - @lifi/widget-provider@4.2.0

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
