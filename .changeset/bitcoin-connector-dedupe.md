---
'@lifi/widget-provider-bitcoin': patch
---

Ignore a duplicate Bitcoin connector. Passing `metamask()` through `connectors` is now redundant because it is a default, and an integrator who still does would otherwise see MetaMask listed twice.
