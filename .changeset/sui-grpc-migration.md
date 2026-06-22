---
'@lifi/widget-provider-sui': patch
'@lifi/widget-light': patch
---

Migrate the Sui integration to the gRPC client (`@mysten/sui/grpc`) ahead of Sui's JSON-RPC sunset. The iframe-embedded provider now creates a `SuiGrpcClient`, `@mysten/sui/jsonRpc` is no longer used anywhere in the widget, and the `@mysten/dapp-kit-react` peer dependency is bumped to `^2.1.3`.
