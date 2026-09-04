# @lifi/wallet-management

## 4.2.0

### Minor Changes

- [#827](https://github.com/lifinance/widget/pull/827) [`1d7bf36`](https://github.com/lifinance/widget/commit/1d7bf36f298db238e0402871a82488078da4b917) Thanks [@chybisov](https://github.com/chybisov)! - Add Stellar (STL) support. Introduces the `@lifi/widget-provider-stellar` package, which integrates the Stellar Wallets Kit (Freighter, xBull, Lobstr, Rabet, Hana, Klever, OneKey, and Bitget) and exposes the connected account and signer to the widget. Adds the base `StellarContext`, wires Stellar into wallet management (account aggregation, combined wallet list, and the connect menu), enables the Stellar ecosystem in the widget's wallet providers, and makes Stellar selectable as a route chain.

### Patch Changes

- [#864](https://github.com/lifinance/widget/pull/864) [`e3709d0`](https://github.com/lifinance/widget/commit/e3709d0fc4bc2b8e848b1792f8b6321a2956008f) Thanks [@chybisov](https://github.com/chybisov)! - Update `i18next` to 26.4.1 and `react-i18next` to 17.0.13.

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

- [#858](https://github.com/lifinance/widget/pull/858) [`a5997eb`](https://github.com/lifinance/widget/commit/a5997ebf00df18cfe105d8390a437d7d853d780d) Thanks [@chybisov](https://github.com/chybisov)! - Bump `@mui/material`, `@mui/system`, and `@mui/icons-material` to 9.4.0.

- [#847](https://github.com/lifinance/widget/pull/847) [`874158c`](https://github.com/lifinance/widget/commit/874158c47bcc83eb6a12317a56e57b4b0c3d29e7) Thanks [@chybisov](https://github.com/chybisov)! - Update runtime dependencies, including `@lifi/sdk` 4.4.0 and the `@lifi/sdk-provider-*` packages.

- [#852](https://github.com/lifinance/widget/pull/852) [`a1cddf8`](https://github.com/lifinance/widget/commit/a1cddf8177523c6db54bd69f6c7e7b00af3314fc) Thanks [@chybisov](https://github.com/chybisov)! - Update runtime dependencies, including `i18next` 26.4 and `react-i18next` 17.0.12.
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

- [#817](https://github.com/lifinance/widget/pull/817) [`682e043`](https://github.com/lifinance/widget/commit/682e0430644efc6f4463cb5e016f7f2f21078220) Thanks [@chybisov](https://github.com/chybisov)! - Add the checkout session core to `@lifi/widget-provider` (contexts, session client, on-ramp session registry) and expose shared widget primitives via `@lifi/widget/shared`.

- Updated dependencies [[`682e043`](https://github.com/lifinance/widget/commit/682e0430644efc6f4463cb5e016f7f2f21078220), [`682e043`](https://github.com/lifinance/widget/commit/682e0430644efc6f4463cb5e016f7f2f21078220), [`682e043`](https://github.com/lifinance/widget/commit/682e0430644efc6f4463cb5e016f7f2f21078220)]:
  - @lifi/widget-provider@4.3.0

## 4.1.1

### Patch Changes

- [#816](https://github.com/lifinance/widget/pull/816) [`5071e9e`](https://github.com/lifinance/widget/commit/5071e9e93febb833b7a5989ab30586d4dcf527d5) Thanks [@chybisov](https://github.com/chybisov)! - Bump dependencies (@lifi/sdk → 4.1.x, MUI, wagmi, vite, and others).

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

- [#818](https://github.com/lifinance/widget/pull/818) [`a7e6b92`](https://github.com/lifinance/widget/commit/a7e6b92d0bbe5ca066f49a076521e9e7ce00bfcc) Thanks [@chybisov](https://github.com/chybisov)! - Bump dependencies (MUI 9.2, wagmi 3.7, viem 2.54.6, TanStack Router/Virtual, i18next, motion, and @lifi/sdk-provider-{ethereum,solana}).

- Updated dependencies [[`5071e9e`](https://github.com/lifinance/widget/commit/5071e9e93febb833b7a5989ab30586d4dcf527d5), [`6d19d22`](https://github.com/lifinance/widget/commit/6d19d22f9ed796a0067cccb14885c15d0ca6061d), [`bf91f25`](https://github.com/lifinance/widget/commit/bf91f25149496c00e1e5635e6d65d848c49a56c9)]:
  - @lifi/widget-provider@4.2.0

## 4.1.0

### Minor Changes

- [#796](https://github.com/lifinance/widget/pull/796) [`80c1387`](https://github.com/lifinance/widget/commit/80c13872909381a614bbca3669b37ee2e09b4902) Thanks [@chybisov](https://github.com/chybisov)! - Drop React 18 support and require React 19+. The `react`/`react-dom` peer dependency range is narrowed from `>=18` to `>=19`, and the components are modernized to React 19 idioms (refs passed as props instead of `forwardRef`, `use()` for context). The `widget-provider-*` packages now use React-19-only APIs and declare a `react: >=19` peer dependency. Integrators must be on React 19 or newer.

### Patch Changes

- [#798](https://github.com/lifinance/widget/pull/798) [`873fd1e`](https://github.com/lifinance/widget/commit/873fd1eb0561415d0bcd51d42f3a292eb5ad2483) Thanks [@chybisov](https://github.com/chybisov)! - Update third-party runtime dependencies to their latest compatible versions (MUI 9.1, wagmi 3.6.17, viem ^2.52.2, TanStack Router/Virtual, i18next 26.3.1, and Tron/Sui/Solana wallet adapters).

- [#800](https://github.com/lifinance/widget/pull/800) [`52cbaa2`](https://github.com/lifinance/widget/commit/52cbaa2777223476b7cd4898cdd06d22b16a6037) Thanks [@chybisov](https://github.com/chybisov)! - Remove Porto wallet connector support following the Ithaca Porto sunset. The `porto` option on `EthereumProviderConfig` and `createDefaultWagmiConfig` is removed, along with the Porto wallet icon and tag.

- [#795](https://github.com/lifinance/widget/pull/795) [`900dc78`](https://github.com/lifinance/widget/commit/900dc78f1533c291ac08820753d8fe72779ff0e6) Thanks [@effie-ms](https://github.com/effie-ms)! - Revert showing Ledger as a multichain wallet in ecosystem selection, as Ledger is no longer supported.

- Updated dependencies [[`80c1387`](https://github.com/lifinance/widget/commit/80c13872909381a614bbca3669b37ee2e09b4902)]:
  - @lifi/widget-provider@4.1.0

## 4.0.0

### Patch Changes

- [#757](https://github.com/lifinance/widget/pull/757) [`168e0df`](https://github.com/lifinance/widget/commit/168e0df2f7bfd732dafe8c42cb73ee9988887a4c) Thanks [@chybisov](https://github.com/chybisov)! - Bump dependencies and raise the `wagmi` / `@wagmi/core` / `viem` peer ranges.

  `@lifi/widget-provider-ethereum` and `@lifi/widget-light` now require `wagmi@^3.6.16` and `@wagmi/core@^3.5.0` (plus `viem@^2.52.0` for `widget-light`). This pulls in `@wagmi/connectors@8.0.15`, whose `metaMask` connector answers pre-connect probe methods (`getProvider`/`isAuthorized`/`getAccounts`/`getChainId`) from the injected EIP-6963 provider when present — so registering the MetaMask SDK connector no longer downloads `@metamask/connect-evm` on page load for users with the extension installed.

- [#720](https://github.com/lifinance/widget/pull/720) [`1fbc970`](https://github.com/lifinance/widget/commit/1fbc9701c3db0d0a88f8fcd484d83111cac3096a) Thanks [@shahbaz17](https://github.com/shahbaz17)! - Load the MetaMask Connect EVM (SDK) connector even when the extension is installed, so MetaMask connections route through the SDK consistently across desktop and mobile. The wallet picker keeps a single MetaMask entry, and the SDK connector is tagged as installed when the extension is detected.

- [#716](https://github.com/lifinance/widget/pull/716) [`e913e5f`](https://github.com/lifinance/widget/commit/e913e5f87192b3abb092dea0941ed2cd880ae005) Thanks [@effie-ms](https://github.com/effie-ms)! - Allow customizing the `MuiDrawer` theme component, use spread-aware `box-shadow`, and standardize the grey palette (grey[300]/grey[800]).

- Updated dependencies []:
  - @lifi/widget-provider@4.0.0
