---
'@lifi/widget-provider-ethereum': patch
'@lifi/widget': patch
---

Remove the Merkle RPC (`https://eth.merkle.io`) from the default mainnet seed chain. viem bundles it as the mainnet default, but it is a shared public endpoint that surfaced intermittent CORS errors in the browser (consistent with rate-limiting), causing failed/slow Ethereum quotes until the request retried elsewhere. The seed chain no longer carries a public RPC of its own; the real RPCs arrive from the backend via `useSyncWagmiConfig` before any mainnet read fires. The default client wraps the synced RPCs in a `fallback` transport for per-request failover. `useIsContractAddress` now waits until the chain is available from the backend before reading on-chain, so it no longer runs against the unsynced default client.
