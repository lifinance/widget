---
"@lifi/widget": patch
---

Normalize slippage values containing one comma and no dot, so `0,5` is handled
as `0.5` instead of being truncated to `0`.
