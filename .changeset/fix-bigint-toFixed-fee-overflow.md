---
"@lifi/widget": patch
---

Fix `getAccumulatedFeeCostsBreakdown` and `useGasSufficiency` throwing `SyntaxError: Cannot convert Xe+Y to a BigInt` for real fee/gas amounts at or above 1e21 wei (routes involving high-supply, low-value tokens like SHIB or PEPE routinely exceed this). The old code round-tripped wei strings through `Number(...).toFixed(0)`, which switches to exponential notation above that threshold; `BigInt()` rejects exponential-notation strings.
