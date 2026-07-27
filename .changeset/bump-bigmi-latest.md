---
'@lifi/widget-light': patch
'@lifi/widget-provider-bitcoin': patch
---

chore: bump `@bigmi/client` to `^0.10.1` and `@bigmi/react` to `^0.9.1`

Ranges stay aligned across `@lifi/widget-light` and `@lifi/widget-provider-bitcoin` so a single
`@bigmi/client` copy is resolved. `@bigmi/core` is unchanged — `^0.9.0` is already the latest release.
