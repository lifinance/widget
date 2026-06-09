---
'@lifi/widget-provider-ethereum': patch
---

Remove the Merkle RPC (`https://eth.merkle.io`) from the default mainnet seed chain. viem bundles it as the mainnet default, but it is a shared public endpoint that surfaced intermittent CORS errors in the browser (consistent with rate-limiting), causing failed/slow Ethereum quotes until the request retried elsewhere. The seed chain now uses CORS-enabled public RPCs and the default client wraps them in a `fallback` transport for per-request failover.
