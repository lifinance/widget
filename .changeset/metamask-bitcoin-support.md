---
'@lifi/widget-provider-bitcoin': minor
'@lifi/widget-provider': patch
'@lifi/wallet-management': patch
---

feat: add MetaMask Bitcoin wallet support

Wires the new Bigmi `metamask()` connector into the default Bitcoin config and
registers MetaMask's Bitcoin Wallet Standard adapter
(`@metamask/bitcoin-wallet-standard` + `@metamask/multichain-api-client`) so the
wallet is discoverable. MetaMask Bitcoin is detected via the shared
`window.ethereum.isMetaMask` signal (it rides the same extension as MetaMask
EVM) and reuses the MetaMask icon, so it dedupes with MetaMask EVM in the wallet
list.
