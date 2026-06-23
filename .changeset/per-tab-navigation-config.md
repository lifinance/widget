---
'@lifi/widget': minor
---

Internal: `_navigationTabs` entries now carry a per-tab `config` (`Partial<WidgetConfig>`) instead of just a key, so an active tab can override any widget config field. Removes the built-in per-key preset table. `_navigationTabs` remains internal and is not part of the public API.
