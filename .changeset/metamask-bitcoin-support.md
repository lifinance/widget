---
'@lifi/widget-provider': minor
'@lifi/widget-provider-bitcoin': minor
'@lifi/wallet-management': patch
---

feat: recognize MetaMask Bitcoin in the wallet list

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
