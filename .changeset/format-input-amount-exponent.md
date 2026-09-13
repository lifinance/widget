---
'@lifi/widget': patch
---

Fix `formatInputAmount` flipping the sign of a negative exponent, so `1e-1` no longer normalizes to `1e1`. Exponential input is now expanded to plain decimal digits, which `parseUnits` accepts.
