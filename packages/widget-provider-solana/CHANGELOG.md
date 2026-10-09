# @lifi/widget-provider-solana

## 4.1.8

### Patch Changes

- [#903](https://github.com/lifinance/widget/pull/903) [`4458495`](https://github.com/lifinance/widget/commit/4458495061371d770ba48ff856cb0feecf0c6357) Thanks [@chybisov](https://github.com/chybisov)! - Update `@lifi/sdk` to 4.12.0 and the LI.FI SDK providers to latest: `@lifi/sdk-provider-bitcoin` 4.1.1, `@lifi/sdk-provider-ethereum` 4.2.8, `@lifi/sdk-provider-solana` 4.3.5, `@lifi/sdk-provider-stellar` 4.3.9, `@lifi/sdk-provider-sui` 4.2.9, `@lifi/sdk-provider-tron` 4.1.8 and `@lifi/sdk-provider-zcash` 4.0.1. After a user rejects a batched swap in MetaMask, "Try again" asks for a new signature again.
- Updated dependencies [[`4458495`](https://github.com/lifinance/widget/commit/4458495061371d770ba48ff856cb0feecf0c6357)]:
  - @lifi/widget-provider@4.6.1

## 4.1.7

### Patch Changes

- [#896](https://github.com/lifinance/widget/pull/896) [`10d954a`](https://github.com/lifinance/widget/commit/10d954aaa9d4cc125c08045c0dd872d2549ec753) Thanks [@chybisov](https://github.com/chybisov)! - Update `@lifi/sdk` to 4.11.0. A resumed route no longer signs a second transaction while the first one may still land.

- [#896](https://github.com/lifinance/widget/pull/896) [`10d954a`](https://github.com/lifinance/widget/commit/10d954aaa9d4cc125c08045c0dd872d2549ec753) Thanks [@chybisov](https://github.com/chybisov)! - Update the LI.FI SDK providers to latest: `@lifi/sdk-provider-bitcoin` 4.1.0, `@lifi/sdk-provider-ethereum` 4.2.7, `@lifi/sdk-provider-solana` 4.3.4, `@lifi/sdk-provider-stellar` 4.3.8, `@lifi/sdk-provider-sui` 4.2.8 and `@lifi/sdk-provider-tron` 4.1.7.

- [#884](https://github.com/lifinance/widget/pull/884) [`97e59c5`](https://github.com/lifinance/widget/commit/97e59c58c719805198e030a14fbe72fabde010c8) Thanks [@chybisov](https://github.com/chybisov)! - ZEC is a destination-only chain. It never appears as a source chain or source token, and a `fromChain` of ZEC from the widget config or the URL is ignored. A ZEC receiver must be a transparent Zcash address (`t1…` or `t3…`) or a unified address (`u1…`) with an Orchard receiver; Sapling, TEX and other unified addresses get a message that names the accepted formats. The address inputs take up to 512 characters, so a unified address fits.
  
  Receivers are now checked against the destination chain, not only its chain type, so a Bitcoin address no longer passes as a ZEC receiver. A connected Bitcoin wallet is never filled in, offered, seeded or priced as a ZEC receiver, and a BTC → ZEC route asks for a receiver. Bookmarks of other ecosystems still save as before, and a Zcash bookmark shows the Zcash icon. The reverse and swap controls stay hidden while the destination chain is not allowed as a source by `chains.from`, so they never select a source chain the config excludes.
  
  `@lifi/widget-provider` exports `useAddressForChain`, which returns `isAddressForChain(address, chain)`, and the `ChainRef` and `IsAddressForChain` types. Every package that depends on the SDK requires the release whose `isAddress` accepts a chain ID, so a consumer keeps a single `@lifi/sdk`. The widget now passes the chain ID to each provider's `isAddress`, so upgrade the `@lifi/widget-provider-*` packages together with `@lifi/widget`: an older `@lifi/widget-provider-bitcoin` refuses every Bitcoin receiver and hides Bitcoin balances. `name` and `version` exported from `@lifi/widget` stay the widget's own now that `@lifi/sdk` exports the same names.
- Updated dependencies [[`10d954a`](https://github.com/lifinance/widget/commit/10d954aaa9d4cc125c08045c0dd872d2549ec753), [`97e59c5`](https://github.com/lifinance/widget/commit/97e59c58c719805198e030a14fbe72fabde010c8), [`97e59c5`](https://github.com/lifinance/widget/commit/97e59c58c719805198e030a14fbe72fabde010c8)]:
  - @lifi/widget-provider@4.6.0

## 4.1.6

### Patch Changes

- [#891](https://github.com/lifinance/widget/pull/891) [`0b3811c`](https://github.com/lifinance/widget/commit/0b3811ce2492b385219659632fd157b3b4923c57) Thanks [@chybisov](https://github.com/chybisov)! - Update `@lifi/sdk` to 4.10.0 and the chain providers together: `@lifi/sdk-provider-bitcoin` 4.0.15, `@lifi/sdk-provider-ethereum` 4.2.4, `@lifi/sdk-provider-solana` 4.3.1, `@lifi/sdk-provider-stellar` 4.3.5, `@lifi/sdk-provider-sui` 4.2.5 and `@lifi/sdk-provider-tron` 4.1.5. Concurrent `getChains` and `getTokens` calls from clients on different API bases no longer share one response, and a caller that aborts a shared request no longer fails the others. `WidgetConfig.sdkConfig.rpcUrls` also accepts per-role lists (`{ read, write, bundle }`); the Solana provider sends transactions and Jito bundles through them. A rejected Solana signature shows as `SignatureRejected` instead of `UnknownError`.
- Updated dependencies [[`0b3811c`](https://github.com/lifinance/widget/commit/0b3811ce2492b385219659632fd157b3b4923c57)]:
  - @lifi/widget-provider@4.5.1

## 4.1.5

### Patch Changes

- [#870](https://github.com/lifinance/widget/pull/870) [`57ae5ac`](https://github.com/lifinance/widget/commit/57ae5ac7cbdd86579e8546e31c96109308f92128) Thanks [@chybisov](https://github.com/chybisov)! - Update `@lifi/sdk` to 4.7.0.

- [#880](https://github.com/lifinance/widget/pull/880) [`0bf9966`](https://github.com/lifinance/widget/commit/0bf9966a23a1a56e79d58e6e99f02df5b913688b) Thanks [@chybisov](https://github.com/chybisov)! - Update `@lifi/sdk` to 4.8.0.

- [#870](https://github.com/lifinance/widget/pull/870) [`57ae5ac`](https://github.com/lifinance/widget/commit/57ae5ac7cbdd86579e8546e31c96109308f92128) Thanks [@chybisov](https://github.com/chybisov)! - Update the LI.FI SDK providers to latest: `@lifi/sdk-provider-bitcoin` 4.0.10, `@lifi/sdk-provider-ethereum` 4.1.0, `@lifi/sdk-provider-solana` 4.2.0, `@lifi/sdk-provider-stellar` 4.3.0, `@lifi/sdk-provider-sui` 4.2.0 and `@lifi/sdk-provider-tron` 4.1.0.

- [#880](https://github.com/lifinance/widget/pull/880) [`0bf9966`](https://github.com/lifinance/widget/commit/0bf9966a23a1a56e79d58e6e99f02df5b913688b) Thanks [@chybisov](https://github.com/chybisov)! - Update the LI.FI SDK providers to latest: `@lifi/sdk-provider-bitcoin` 4.0.11, `@lifi/sdk-provider-ethereum` 4.2.0, `@lifi/sdk-provider-solana` 4.2.1, `@lifi/sdk-provider-stellar` 4.3.1, `@lifi/sdk-provider-sui` 4.2.1 and `@lifi/sdk-provider-tron` 4.1.1.
- Updated dependencies [[`1590c19`](https://github.com/lifinance/widget/commit/1590c1907376b800c556b139a10400fc301ca2cf), [`e9c695f`](https://github.com/lifinance/widget/commit/e9c695f9981d60bd23cff85d2c3324a739ebf0d7), [`57ae5ac`](https://github.com/lifinance/widget/commit/57ae5ac7cbdd86579e8546e31c96109308f92128), [`0bf9966`](https://github.com/lifinance/widget/commit/0bf9966a23a1a56e79d58e6e99f02df5b913688b)]:
  - @lifi/widget-provider@4.5.0

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

- Updated dependencies [[`682e043`](https://github.com/lifinance/widget/commit/682e0430644efc6f4463cb5e016f7f2f21078220), [`682e043`](https://github.com/lifinance/widget/commit/682e0430644efc6f4463cb5e016f7f2f21078220), [`682e043`](https://github.com/lifinance/widget/commit/682e0430644efc6f4463cb5e016f7f2f21078220)]:
  - @lifi/widget-provider@4.3.0

## 4.1.1

### Patch Changes

- [#816](https://github.com/lifinance/widget/pull/816) [`5071e9e`](https://github.com/lifinance/widget/commit/5071e9e93febb833b7a5989ab30586d4dcf527d5) Thanks [@chybisov](https://github.com/chybisov)! - Bump dependencies (@lifi/sdk → 4.1.x, MUI, wagmi, vite, and others).

- [#818](https://github.com/lifinance/widget/pull/818) [`a7e6b92`](https://github.com/lifinance/widget/commit/a7e6b92d0bbe5ca066f49a076521e9e7ce00bfcc) Thanks [@chybisov](https://github.com/chybisov)! - Bump dependencies (MUI 9.2, wagmi 3.7, viem 2.54.6, TanStack Router/Virtual, i18next, motion, and @lifi/sdk-provider-{ethereum,solana}).

- Updated dependencies [[`5071e9e`](https://github.com/lifinance/widget/commit/5071e9e93febb833b7a5989ab30586d4dcf527d5), [`6d19d22`](https://github.com/lifinance/widget/commit/6d19d22f9ed796a0067cccb14885c15d0ca6061d), [`bf91f25`](https://github.com/lifinance/widget/commit/bf91f25149496c00e1e5635e6d65d848c49a56c9)]:
  - @lifi/widget-provider@4.2.0

## 4.1.0

### Minor Changes

- [#796](https://github.com/lifinance/widget/pull/796) [`80c1387`](https://github.com/lifinance/widget/commit/80c13872909381a614bbca3669b37ee2e09b4902) Thanks [@chybisov](https://github.com/chybisov)! - Drop React 18 support and require React 19+. The `react`/`react-dom` peer dependency range is narrowed from `>=18` to `>=19`, and the components are modernized to React 19 idioms (refs passed as props instead of `forwardRef`, `use()` for context). The `widget-provider-*` packages now use React-19-only APIs and declare a `react: >=19` peer dependency. Integrators must be on React 19 or newer.

### Patch Changes

- [#798](https://github.com/lifinance/widget/pull/798) [`873fd1e`](https://github.com/lifinance/widget/commit/873fd1eb0561415d0bcd51d42f3a292eb5ad2483) Thanks [@chybisov](https://github.com/chybisov)! - Update third-party runtime dependencies to their latest compatible versions (MUI 9.1, wagmi 3.6.17, viem ^2.52.2, TanStack Router/Virtual, i18next 26.3.1, and Tron/Sui/Solana wallet adapters).

- Updated dependencies [[`80c1387`](https://github.com/lifinance/widget/commit/80c13872909381a614bbca3669b37ee2e09b4902)]:
  - @lifi/widget-provider@4.1.0

## 4.0.0

### Patch Changes

- [#757](https://github.com/lifinance/widget/pull/757) [`168e0df`](https://github.com/lifinance/widget/commit/168e0df2f7bfd732dafe8c42cb73ee9988887a4c) Thanks [@chybisov](https://github.com/chybisov)! - Bump dependencies and raise the `wagmi` / `@wagmi/core` / `viem` peer ranges.

  `@lifi/widget-provider-ethereum` and `@lifi/widget-light` now require `wagmi@^3.6.16` and `@wagmi/core@^3.5.0` (plus `viem@^2.52.0` for `widget-light`). This pulls in `@wagmi/connectors@8.0.15`, whose `metaMask` connector answers pre-connect probe methods (`getProvider`/`isAuthorized`/`getAccounts`/`getChainId`) from the injected EIP-6963 provider when present — so registering the MetaMask SDK connector no longer downloads `@metamask/connect-evm` on page load for users with the extension installed.

- Updated dependencies []:
  - @lifi/widget-provider@4.0.0
