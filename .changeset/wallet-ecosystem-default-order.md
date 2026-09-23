---
'@lifi/wallet-management': minor
---

Order a multichain wallet's ecosystems Ethereum, Solana, Sui, Bitcoin, Tron, Stellar, via an explicit `defaultWalletEcosystemsOrder` that is exported so integrators can read it.

**This changes the displayed order.** It was previously a side effect of the sequence the wallet lists were combined in — Ethereum, Bitcoin, Solana, Sui, Tron, Stellar — so Bitcoin moves from second to fourth for every multichain wallet you do not name in `walletEcosystemsOrder`.

`walletConfig.walletEcosystemsOrder` still wins for the wallets it names, and now only needs the ecosystems you want to move — anything left out follows the default instead of falling back to the list-building order.
