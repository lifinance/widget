---
"@lifi/widget-provider-ethereum": patch
---

`syncWagmiConfig` no longer sets up the connectors again when only chain prices change. Each chains refetch did this every 5 minutes. After that, wagmi missed chain, account and disconnect events from connectors that bind their event handlers one time. Examples are MetaMask Connect, WalletConnect, Coinbase and Base Account. The wagmi chain then stayed old, so a batched swap could use the wrong chain id.

A real change of the chains or the connectors still sets up the connectors again. The connectors now send their events to the newest connector object. This applies when `syncWagmiConfig` sets up a connector first, as for the connectors from `createDefaultWagmiConfig`.
