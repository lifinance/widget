---
'@lifi/wallet-management': minor
---

Order a multichain wallet's ecosystems Ethereum, Solana, Sui, Bitcoin, Tron, Stellar. That order was previously a side effect of the sequence the wallet lists were combined in; it is now an explicit `defaultWalletEcosystemsOrder`, exported so integrators can read it.

`walletConfig.walletEcosystemsOrder` still wins for the wallets it names, and now only needs the ecosystems you want to move — anything left out follows the default instead of falling back to the list-building order.
