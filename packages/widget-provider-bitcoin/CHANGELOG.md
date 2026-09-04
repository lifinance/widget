# @lifi/widget-provider-bitcoin

## 4.2.3

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

- [#847](https://github.com/lifinance/widget/pull/847) [`874158c`](https://github.com/lifinance/widget/commit/874158c47bcc83eb6a12317a56e57b4b0c3d29e7) Thanks [@chybisov](https://github.com/chybisov)! - Update runtime dependencies, including `@lifi/sdk` 4.4.0 and the `@lifi/sdk-provider-*` packages.
- Updated dependencies [[`1d7bf36`](https://github.com/lifinance/widget/commit/1d7bf36f298db238e0402871a82488078da4b917), [`874158c`](https://github.com/lifinance/widget/commit/874158c47bcc83eb6a12317a56e57b4b0c3d29e7), [`2b290ab`](https://github.com/lifinance/widget/commit/2b290abb0fe9adb1ac5c1f6eb6fbb55e158fadea), [`874158c`](https://github.com/lifinance/widget/commit/874158c47bcc83eb6a12317a56e57b4b0c3d29e7)]:
  - @lifi/widget-provider@4.4.0

## 4.2.2

### Patch Changes

- [#836](https://github.com/lifinance/widget/pull/836) [`676c5b4`](https://github.com/lifinance/widget/commit/676c5b4b0e763bb0c069f49ac6f5afeeacb5f617) Thanks [@chybisov](https://github.com/chybisov)! - chore: bump `@bigmi/client` to `^0.10.1` and `@bigmi/react` to `^0.9.1`

  Ranges stay aligned across `@lifi/widget-light` and `@lifi/widget-provider-bitcoin` so a single
  `@bigmi/client` copy is resolved. `@bigmi/core` is unchanged — `^0.9.0` is already the latest release.

- [#836](https://github.com/lifinance/widget/pull/836) [`676c5b4`](https://github.com/lifinance/widget/commit/676c5b4b0e763bb0c069f49ac6f5afeeacb5f617) Thanks [@chybisov](https://github.com/chybisov)! - chore: bump `@lifi/sdk` to `^4.3.0` and align duplicate-prone ranges

  Move every package and example to `@lifi/sdk@^4.3.0` and refresh the
  `@lifi/sdk-provider-*` ranges. `viem` and `@reown/appkit` ranges now match the
  `pnpm-workspace.yaml` overrides (`>=2.52.0` / `>=1.8.20`) so consumers resolve a single
  copy instead of a second one pulled in by a tighter caret range.

- Updated dependencies [[`676c5b4`](https://github.com/lifinance/widget/commit/676c5b4b0e763bb0c069f49ac6f5afeeacb5f617)]:
  - @lifi/widget-provider@4.3.1

## 4.2.1

### Patch Changes

- [#828](https://github.com/lifinance/widget/pull/828) [`1c6f5a2`](https://github.com/lifinance/widget/commit/1c6f5a235ec6347fd045c14d8cea4444c1e2eb84) Thanks [@chybisov](https://github.com/chybisov)! - chore: bump dependencies to their latest versions

  Upgrade to TypeScript 7 and refresh runtime dependency ranges: `viem`, `@bigmi/*`, `i18next`, `react-i18next`, `react-intersection-observer`, `@mysten/sui`, `@meshconnect/web-link-sdk`, and the `@lifi/sdk-provider-*` packages. Aligns the `@bigmi/react` range across `@lifi/widget-provider-bitcoin` and `@lifi/widget-light` so a single `@bigmi/client` copy is resolved.

- Updated dependencies [[`682e043`](https://github.com/lifinance/widget/commit/682e0430644efc6f4463cb5e016f7f2f21078220), [`682e043`](https://github.com/lifinance/widget/commit/682e0430644efc6f4463cb5e016f7f2f21078220), [`682e043`](https://github.com/lifinance/widget/commit/682e0430644efc6f4463cb5e016f7f2f21078220)]:
  - @lifi/widget-provider@4.3.0

## 4.2.0

### Minor Changes

- [#805](https://github.com/lifinance/widget/pull/805) [`6d19d22`](https://github.com/lifinance/widget/commit/6d19d22f9ed796a0067cccb14885c15d0ca6061d) Thanks [@chybisov](https://github.com/chybisov)! - feat: recognize MetaMask Bitcoin in the wallet list

  Adds MetaMask Bitcoin (`io.metamask.bitcoin`) detection (via the shared
  `window.ethereum.isMetaMask` signal, same extension as MetaMask EVM) and icon, so
  it dedupes with MetaMask EVM in the wallet list. `BitcoinProvider` now accepts a
  `connectors` option to append extra Bigmi connectors.

  The connector itself is opt-in, mirroring `reown()`: install
  `@metamask/bitcoin-wallet-standard` + `@metamask/multichain-api-client`, call
  `registerBitcoinWalletStandard({ client })`, and add `metamask()` (from
  `@bigmi/client`) via `BitcoinProvider({ connectors: [metamask()] })` or
  `createDefaultBigmiConfig`. No `@metamask/*` deps are added to the widget packages.

  Also bumps `@bigmi/client` to `^0.9.0` and `@bigmi/react` to `^0.8.2`.

### Patch Changes

- [#816](https://github.com/lifinance/widget/pull/816) [`5071e9e`](https://github.com/lifinance/widget/commit/5071e9e93febb833b7a5989ab30586d4dcf527d5) Thanks [@chybisov](https://github.com/chybisov)! - Bump dependencies (@lifi/sdk → 4.1.x, MUI, wagmi, vite, and others).

- [#804](https://github.com/lifinance/widget/pull/804) [`bf91f25`](https://github.com/lifinance/widget/commit/bf91f25149496c00e1e5635e6d65d848c49a56c9) Thanks [@chybisov](https://github.com/chybisov)! - Remove Phantom from the Bitcoin wallet connectors. Phantom deprecated its Bitcoin wallet and removed the injected `window.phantom.bitcoin` provider, so it no longer connects for Bitcoin. The default Bitcoin config no longer registers the `phantom()` connector, and the `app.phantom.bitcoin` installed-wallet detection has been removed. Phantom for Solana/EVM is unaffected.

- Updated dependencies [[`5071e9e`](https://github.com/lifinance/widget/commit/5071e9e93febb833b7a5989ab30586d4dcf527d5), [`6d19d22`](https://github.com/lifinance/widget/commit/6d19d22f9ed796a0067cccb14885c15d0ca6061d), [`bf91f25`](https://github.com/lifinance/widget/commit/bf91f25149496c00e1e5635e6d65d848c49a56c9)]:
  - @lifi/widget-provider@4.2.0

## 4.1.0

### Minor Changes

- [#796](https://github.com/lifinance/widget/pull/796) [`80c1387`](https://github.com/lifinance/widget/commit/80c13872909381a614bbca3669b37ee2e09b4902) Thanks [@chybisov](https://github.com/chybisov)! - Drop React 18 support and require React 19+. The `react`/`react-dom` peer dependency range is narrowed from `>=18` to `>=19`, and the components are modernized to React 19 idioms (refs passed as props instead of `forwardRef`, `use()` for context). The `widget-provider-*` packages now use React-19-only APIs and declare a `react: >=19` peer dependency. Integrators must be on React 19 or newer.

### Patch Changes

- Updated dependencies [[`80c1387`](https://github.com/lifinance/widget/commit/80c13872909381a614bbca3669b37ee2e09b4902)]:
  - @lifi/widget-provider@4.1.0

## 4.0.0

### Patch Changes

- Updated dependencies []:
  - @lifi/widget-provider@4.0.0
