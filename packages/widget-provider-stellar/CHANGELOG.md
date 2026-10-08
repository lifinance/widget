# @lifi/widget-provider-stellar

## 4.2.3

### Patch Changes

- [#896](https://github.com/lifinance/widget/pull/896) [`10d954a`](https://github.com/lifinance/widget/commit/10d954aaa9d4cc125c08045c0dd872d2549ec753) Thanks [@chybisov](https://github.com/chybisov)! - Update `@lifi/sdk` to 4.11.0. A resumed route no longer signs a second transaction while the first one may still land.

- [#896](https://github.com/lifinance/widget/pull/896) [`10d954a`](https://github.com/lifinance/widget/commit/10d954aaa9d4cc125c08045c0dd872d2549ec753) Thanks [@chybisov](https://github.com/chybisov)! - Update the LI.FI SDK providers to latest: `@lifi/sdk-provider-bitcoin` 4.1.0, `@lifi/sdk-provider-ethereum` 4.2.7, `@lifi/sdk-provider-solana` 4.3.4, `@lifi/sdk-provider-stellar` 4.3.8, `@lifi/sdk-provider-sui` 4.2.8 and `@lifi/sdk-provider-tron` 4.1.7.

- [#896](https://github.com/lifinance/widget/pull/896) [`10d954a`](https://github.com/lifinance/widget/commit/10d954aaa9d4cc125c08045c0dd872d2549ec753) Thanks [@chybisov](https://github.com/chybisov)! - Update `@creit.tech/stellar-wallets-kit` to 2.7.0.

- [#884](https://github.com/lifinance/widget/pull/884) [`97e59c5`](https://github.com/lifinance/widget/commit/97e59c58c719805198e030a14fbe72fabde010c8) Thanks [@chybisov](https://github.com/chybisov)! - ZEC is a destination-only chain. It never appears as a source chain or source token, and a `fromChain` of ZEC from the widget config or the URL is ignored. A ZEC receiver must be a transparent Zcash address (`t1…` or `t3…`) or a unified address (`u1…`) with an Orchard receiver; Sapling, TEX and other unified addresses get a message that names the accepted formats. The address inputs take up to 512 characters, so a unified address fits.
  
  Receivers are now checked against the destination chain, not only its chain type, so a Bitcoin address no longer passes as a ZEC receiver. A connected Bitcoin wallet is never filled in, offered, seeded or priced as a ZEC receiver, and a BTC → ZEC route asks for a receiver. Bookmarks of other ecosystems still save as before, and a Zcash bookmark shows the Zcash icon. The reverse and swap controls stay hidden while the destination chain is not allowed as a source by `chains.from`, so they never select a source chain the config excludes.
  
  `@lifi/widget-provider` exports `useAddressForChain`, which returns `isAddressForChain(address, chain)`, and the `ChainRef` and `IsAddressForChain` types. Every package that depends on the SDK requires the release whose `isAddress` accepts a chain ID, so a consumer keeps a single `@lifi/sdk`. The widget now passes the chain ID to each provider's `isAddress`, so upgrade the `@lifi/widget-provider-*` packages together with `@lifi/widget`: an older `@lifi/widget-provider-bitcoin` refuses every Bitcoin receiver and hides Bitcoin balances. `name` and `version` exported from `@lifi/widget` stay the widget's own now that `@lifi/sdk` exports the same names.
- Updated dependencies [[`10d954a`](https://github.com/lifinance/widget/commit/10d954aaa9d4cc125c08045c0dd872d2549ec753), [`97e59c5`](https://github.com/lifinance/widget/commit/97e59c58c719805198e030a14fbe72fabde010c8), [`97e59c5`](https://github.com/lifinance/widget/commit/97e59c58c719805198e030a14fbe72fabde010c8)]:
  - @lifi/widget-provider@4.6.0

## 4.2.2

### Patch Changes

- [#891](https://github.com/lifinance/widget/pull/891) [`0b3811c`](https://github.com/lifinance/widget/commit/0b3811ce2492b385219659632fd157b3b4923c57) Thanks [@chybisov](https://github.com/chybisov)! - Update `@lifi/sdk` to 4.10.0 and the chain providers together: `@lifi/sdk-provider-bitcoin` 4.0.15, `@lifi/sdk-provider-ethereum` 4.2.4, `@lifi/sdk-provider-solana` 4.3.1, `@lifi/sdk-provider-stellar` 4.3.5, `@lifi/sdk-provider-sui` 4.2.5 and `@lifi/sdk-provider-tron` 4.1.5. Concurrent `getChains` and `getTokens` calls from clients on different API bases no longer share one response, and a caller that aborts a shared request no longer fails the others. `WidgetConfig.sdkConfig.rpcUrls` also accepts per-role lists (`{ read, write, bundle }`); the Solana provider sends transactions and Jito bundles through them. A rejected Solana signature shows as `SignatureRejected` instead of `UnknownError`.
- Updated dependencies [[`0b3811c`](https://github.com/lifinance/widget/commit/0b3811ce2492b385219659632fd157b3b4923c57)]:
  - @lifi/widget-provider@4.5.1

## 4.2.1

### Patch Changes

- [#870](https://github.com/lifinance/widget/pull/870) [`57ae5ac`](https://github.com/lifinance/widget/commit/57ae5ac7cbdd86579e8546e31c96109308f92128) Thanks [@chybisov](https://github.com/chybisov)! - Update `@lifi/sdk` to 4.7.0.

- [#880](https://github.com/lifinance/widget/pull/880) [`0bf9966`](https://github.com/lifinance/widget/commit/0bf9966a23a1a56e79d58e6e99f02df5b913688b) Thanks [@chybisov](https://github.com/chybisov)! - Update `@lifi/sdk` to 4.8.0.

- [#870](https://github.com/lifinance/widget/pull/870) [`57ae5ac`](https://github.com/lifinance/widget/commit/57ae5ac7cbdd86579e8546e31c96109308f92128) Thanks [@chybisov](https://github.com/chybisov)! - Update the LI.FI SDK providers to latest: `@lifi/sdk-provider-bitcoin` 4.0.10, `@lifi/sdk-provider-ethereum` 4.1.0, `@lifi/sdk-provider-solana` 4.2.0, `@lifi/sdk-provider-stellar` 4.3.0, `@lifi/sdk-provider-sui` 4.2.0 and `@lifi/sdk-provider-tron` 4.1.0.

- [#880](https://github.com/lifinance/widget/pull/880) [`0bf9966`](https://github.com/lifinance/widget/commit/0bf9966a23a1a56e79d58e6e99f02df5b913688b) Thanks [@chybisov](https://github.com/chybisov)! - Update the LI.FI SDK providers to latest: `@lifi/sdk-provider-bitcoin` 4.0.11, `@lifi/sdk-provider-ethereum` 4.2.0, `@lifi/sdk-provider-solana` 4.2.1, `@lifi/sdk-provider-stellar` 4.3.1, `@lifi/sdk-provider-sui` 4.2.1 and `@lifi/sdk-provider-tron` 4.1.1.
- Updated dependencies [[`1590c19`](https://github.com/lifinance/widget/commit/1590c1907376b800c556b139a10400fc301ca2cf), [`e9c695f`](https://github.com/lifinance/widget/commit/e9c695f9981d60bd23cff85d2c3324a739ebf0d7), [`57ae5ac`](https://github.com/lifinance/widget/commit/57ae5ac7cbdd86579e8546e31c96109308f92128), [`0bf9966`](https://github.com/lifinance/widget/commit/0bf9966a23a1a56e79d58e6e99f02df5b913688b)]:
  - @lifi/widget-provider@4.5.0

## 4.2.0

### Minor Changes

- [#827](https://github.com/lifinance/widget/pull/827) [`1d7bf36`](https://github.com/lifinance/widget/commit/1d7bf36f298db238e0402871a82488078da4b917) Thanks [@chybisov](https://github.com/chybisov)! - Add Stellar (STL) support. Introduces the `@lifi/widget-provider-stellar` package, which integrates the Stellar Wallets Kit (Freighter, xBull, Lobstr, Rabet, Hana, Klever, OneKey, and Bitget) and exposes the connected account and signer to the widget. Adds the base `StellarContext`, wires Stellar into wallet management (account aggregation, combined wallet list, and the connect menu), enables the Stellar ecosystem in the widget's wallet providers, and makes Stellar selectable as a route chain.

### Patch Changes

- [#853](https://github.com/lifinance/widget/pull/853) [`f977094`](https://github.com/lifinance/widget/commit/f977094995c8a0645efe689ef7b55880f2d2a4c4) Thanks [@chybisov](https://github.com/chybisov)! - Keep the Stellar Wallets Kit off the server render. The kit's wallet modules read `window` in their constructors, so a framework that server-renders the provider — Next.js prerendering, for example — crashed with `ReferenceError: window is not defined` inside `initStellarWalletsKit`. Without a `window` the store is now built inert: no kit, no availability probe, no listeners. The browser still builds the real singleton in its own module instance, and because its first render also shows no wallets and no address, hydration stays consistent.

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
- Updated dependencies [[`1d7bf36`](https://github.com/lifinance/widget/commit/1d7bf36f298db238e0402871a82488078da4b917), [`874158c`](https://github.com/lifinance/widget/commit/874158c47bcc83eb6a12317a56e57b4b0c3d29e7), [`2b290ab`](https://github.com/lifinance/widget/commit/2b290abb0fe9adb1ac5c1f6eb6fbb55e158fadea), [`874158c`](https://github.com/lifinance/widget/commit/874158c47bcc83eb6a12317a56e57b4b0c3d29e7)]:
  - @lifi/widget-provider@4.4.0
