---
'@lifi/widget': minor
---

Internal: header navigation tabs are now config-driven via the internal `_navigationTabs` option (not part of the public API). The active tab drives the displayed flow's mode, variant and mode options, and the split Swap/Bridge tabs are served by this unified navigation-tabs store — existing `mode: 'split'` behavior is unchanged.
