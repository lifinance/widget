---
"@lifi/widget-provider-ethereum": patch
---

`syncWagmiConfig` no longer sets up the connectors again and reconnects when only the chain data that connectors do not use changes. The chains response includes token prices, so each chains refetch (every 5 minutes) did this before. After that, wagmi did not see chain, account, or disconnect events from connectors that bind their event handlers one time, such as MetaMask Connect, WalletConnect, Coinbase, and Base Account. The wagmi chain stayed old, so a batched swap could go out with the wrong chain id.

When the chain list or the connectors really change, `syncWagmiConfig` still sets up the connectors again. The connectors now send their events to the newest connector object, so wagmi keeps them. This applies to connectors that `syncWagmiConfig` sets up first, which is the case for the connectors from `createDefaultWagmiConfig`.
