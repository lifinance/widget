# @lifi/widget-provider-ethereum

## 4.1.2

### Patch Changes

- [#828](https://github.com/lifinance/widget/pull/828) [`1c6f5a2`](https://github.com/lifinance/widget/commit/1c6f5a235ec6347fd045c14d8cea4444c1e2eb84) Thanks [@chybisov](https://github.com/chybisov)! - chore: bump dependencies to their latest versions

  Upgrade to TypeScript 7 and refresh runtime dependency ranges: `viem`, `@bigmi/*`, `i18next`, `react-i18next`, `react-intersection-observer`, `@mysten/sui`, `@meshconnect/web-link-sdk`, and the `@lifi/sdk-provider-*` packages. Aligns the `@bigmi/react` range across `@lifi/widget-provider-bitcoin` and `@lifi/widget-light` so a single `@bigmi/client` copy is resolved.

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

- [#800](https://github.com/lifinance/widget/pull/800) [`52cbaa2`](https://github.com/lifinance/widget/commit/52cbaa2777223476b7cd4898cdd06d22b16a6037) Thanks [@chybisov](https://github.com/chybisov)! - Remove Porto wallet connector support following the Ithaca Porto sunset. The `porto` option on `EthereumProviderConfig` and `createDefaultWagmiConfig` is removed, along with the Porto wallet icon and tag.

### Patch Changes

- [#798](https://github.com/lifinance/widget/pull/798) [`873fd1e`](https://github.com/lifinance/widget/commit/873fd1eb0561415d0bcd51d42f3a292eb5ad2483) Thanks [@chybisov](https://github.com/chybisov)! - Update third-party runtime dependencies to their latest compatible versions (MUI 9.1, wagmi 3.6.17, viem ^2.52.2, TanStack Router/Virtual, i18next 26.3.1, and Tron/Sui/Solana wallet adapters).

- [#802](https://github.com/lifinance/widget/pull/802) [`6ac5419`](https://github.com/lifinance/widget/commit/6ac541917d2caf4981aecc9622d5908b48f65696) Thanks [@chybisov](https://github.com/chybisov)! - Bump SDK provider dependencies to their latest compatible releases (`@lifi/sdk-provider-ethereum` 4.0.2, `@lifi/sdk-provider-sui` 4.1.0) and align the `viem` range with the workspace override.

- [#771](https://github.com/lifinance/widget/pull/771) [`d513c30`](https://github.com/lifinance/widget/commit/d513c309026e399d007f16b99231d47cb05164a6) Thanks [@tomiiide](https://github.com/tomiiide)! - Remove the Merkle RPC (`https://eth.merkle.io`) from the default mainnet seed chain. viem bundles it as the mainnet default, but it is a shared public endpoint that surfaced intermittent CORS errors in the browser (consistent with rate-limiting), causing failed/slow Ethereum quotes until the request retried elsewhere. The seed chain no longer carries a public RPC of its own; the real RPCs arrive from the backend via `useSyncWagmiConfig` before any mainnet read fires. The default client wraps the synced RPCs in a `fallback` transport for per-request failover. `useIsContractAddress` now waits until the chain is available from the backend before reading on-chain, so it no longer runs against the unsynced default client.

- [#780](https://github.com/lifinance/widget/pull/780) [`a242682`](https://github.com/lifinance/widget/commit/a242682b074ed8f97a55b01dd1bc01f9d79220bc) Thanks [@tomiiide](https://github.com/tomiiide)! - Harden Tron WalletConnect against the EVM connector sharing the same project id.

  - Force `customStoragePrefix: 'evm'` on the EVM WalletConnect connector. The Tron wrapper drops the prefix it is given, so both cores wrote identical `wc@2:…//session` keys and last-writer-wins clobbered the other ecosystem's session (a connected wallet vanished, refresh re-opened the QR). Isolating the EVM side fixes the collision regardless of the wrapper.
  - Reject non-Tron addresses at the Tron provider boundary. The wrapper returns `accounts[0]` across all session namespaces, so scanning with an EVM wallet surfaced an `eip155` `0x…` address as the Tron account and let it flow into the route request as the Tron sender. Connected Tron accounts whose address isn't a valid base58 `T…` are now ignored, and the offending adapter is disconnected.

- Updated dependencies [[`80c1387`](https://github.com/lifinance/widget/commit/80c13872909381a614bbca3669b37ee2e09b4902)]:
  - @lifi/widget-provider@4.1.0

## 4.0.0

### Minor Changes

- [#757](https://github.com/lifinance/widget/pull/757) [`168e0df`](https://github.com/lifinance/widget/commit/168e0df2f7bfd732dafe8c42cb73ee9988887a4c) Thanks [@chybisov](https://github.com/chybisov)! - Bump dependencies and raise the `wagmi` / `@wagmi/core` / `viem` peer ranges.

  `@lifi/widget-provider-ethereum` and `@lifi/widget-light` now require `wagmi@^3.6.16` and `@wagmi/core@^3.5.0` (plus `viem@^2.52.0` for `widget-light`). This pulls in `@wagmi/connectors@8.0.15`, whose `metaMask` connector answers pre-connect probe methods (`getProvider`/`isAuthorized`/`getAccounts`/`getChainId`) from the injected EIP-6963 provider when present — so registering the MetaMask SDK connector no longer downloads `@metamask/connect-evm` on page load for users with the extension installed.

### Patch Changes

- [#720](https://github.com/lifinance/widget/pull/720) [`1fbc970`](https://github.com/lifinance/widget/commit/1fbc9701c3db0d0a88f8fcd484d83111cac3096a) Thanks [@shahbaz17](https://github.com/shahbaz17)! - Load the MetaMask Connect EVM (SDK) connector even when the extension is installed, so MetaMask connections route through the SDK consistently across desktop and mobile. The wallet picker keeps a single MetaMask entry, and the SDK connector is tagged as installed when the extension is detected.

- Updated dependencies []:
  - @lifi/widget-provider@4.0.0
