---
"@lifi/widget-provider-ethereum": patch
---

`syncWagmiConfig` now sets up each connector function and each EIP-6963 wallet one time for each wagmi config. Before, each chains refetch set up all connectors again, every 5 minutes, because chain prices change. After that, wagmi missed chain, account and disconnect events from connectors that bind their event handlers one time. Examples are MetaMask Connect, WalletConnect, Coinbase and Base Account. The wagmi chain then stayed old, so a batched swap could use the wrong chain id.

A chains refetch now only updates the wagmi chains. The connectors read the current chain list, so a new chain works without a new setup. `syncWagmiConfig` runs `reconnect` only when the connector list changes or when wagmi lost the connection. It waits for its earlier `reconnect` to end, so a connector that is added during a `reconnect` is connected too.
