---
'@lifi/widget-provider-tron': patch
---

fix(tron): import wallet adapters from their individual packages

`@tronweb3/tronwallet-adapters@1.3.1` added a `ledger-evm` sub-adapter whose
`@ledgerhq/*` dependencies pull the `Buffer` global. Importing adapters from the
`@tronweb3/tronwallet-adapters` barrel makes bundlers resolve every re-export —
including `ledger-evm` — so consumer Vite builds using `vite-plugin-node-polyfills`
hit that plugin's malformed `./shims/buffer/` export and fail under Rolldown.

Import each adapter the widget uses from its individual `@tronweb3/tronwallet-adapter-*`
package instead, so the unused Ledger-EVM adapter never enters the bundle. No behavior
change — the same adapters are registered.
