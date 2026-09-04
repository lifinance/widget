# @lifi/widget-provider-stellar

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
