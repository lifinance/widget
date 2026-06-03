# @lifi/widget-provider-ethereum

## 4.0.0

### Minor Changes

- [#757](https://github.com/lifinance/widget/pull/757) [`168e0df`](https://github.com/lifinance/widget/commit/168e0df2f7bfd732dafe8c42cb73ee9988887a4c) Thanks [@chybisov](https://github.com/chybisov)! - Bump dependencies and raise the `wagmi` / `@wagmi/core` / `viem` peer ranges.

  `@lifi/widget-provider-ethereum` and `@lifi/widget-light` now require `wagmi@^3.6.16` and `@wagmi/core@^3.5.0` (plus `viem@^2.52.0` for `widget-light`). This pulls in `@wagmi/connectors@8.0.15`, whose `metaMask` connector answers pre-connect probe methods (`getProvider`/`isAuthorized`/`getAccounts`/`getChainId`) from the injected EIP-6963 provider when present — so registering the MetaMask SDK connector no longer downloads `@metamask/connect-evm` on page load for users with the extension installed.

### Patch Changes

- [#720](https://github.com/lifinance/widget/pull/720) [`1fbc970`](https://github.com/lifinance/widget/commit/1fbc9701c3db0d0a88f8fcd484d83111cac3096a) Thanks [@shahbaz17](https://github.com/shahbaz17)! - Load the MetaMask Connect EVM (SDK) connector even when the extension is installed, so MetaMask connections route through the SDK consistently across desktop and mobile. The wallet picker keeps a single MetaMask entry, and the SDK connector is tagged as installed when the extension is detected.

- Updated dependencies []:
  - @lifi/widget-provider@4.0.0
