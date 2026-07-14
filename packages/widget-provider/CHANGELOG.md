# @lifi/widget-provider

## 4.3.0

### Minor Changes

- [#817](https://github.com/lifinance/widget/pull/817) [`682e043`](https://github.com/lifinance/widget/commit/682e0430644efc6f4463cb5e016f7f2f21078220) Thanks [@chybisov](https://github.com/chybisov)! - Add quote-aware Transak checkout wiring by introducing onramp fiat-currencies and quote API contracts, extending onramp session payload/response fields, and carrying provider funding session metadata through checkout session state.

  Switch checkout cash funding to a fiat-first flow with live quote-driven route amounts, dynamic fiat currencies/payment methods, and persisted funding session ids for resume/reconciliation paths.

- [#817](https://github.com/lifinance/widget/pull/817) [`682e043`](https://github.com/lifinance/widget/commit/682e0430644efc6f4463cb5e016f7f2f21078220) Thanks [@chybisov](https://github.com/chybisov)! - Let users reconnect previously linked exchange accounts and set their own destination address in the checkout flow.

- [#817](https://github.com/lifinance/widget/pull/817) [`682e043`](https://github.com/lifinance/widget/commit/682e0430644efc6f4463cb5e016f7f2f21078220) Thanks [@chybisov](https://github.com/chybisov)! - Add the checkout session core to `@lifi/widget-provider` (contexts, session client, on-ramp session registry) and expose shared widget primitives via `@lifi/widget/shared`.

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

## 4.1.0

### Minor Changes

- [#796](https://github.com/lifinance/widget/pull/796) [`80c1387`](https://github.com/lifinance/widget/commit/80c13872909381a614bbca3669b37ee2e09b4902) Thanks [@chybisov](https://github.com/chybisov)! - Drop React 18 support and require React 19+. The `react`/`react-dom` peer dependency range is narrowed from `>=18` to `>=19`, and the components are modernized to React 19 idioms (refs passed as props instead of `forwardRef`, `use()` for context). The `widget-provider-*` packages now use React-19-only APIs and declare a `react: >=19` peer dependency. Integrators must be on React 19 or newer.

## 4.0.0
