---
'@lifi/widget': patch
---

Fix a false "Not enough funds" warning that appeared on the transaction status screen while waiting for the destination chain. Pre-flight warning messages are no longer rendered during the in-progress (pending) execution state, restoring the behavior from before the v4 execution page redesign.
