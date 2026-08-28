---
"@lifi/widget": patch
---

Stop showing the insufficient gas warning on Stellar when the route bridges enough XLM to cover the destination step, so a receiver with an empty XLM balance no longer sees a false warning. When the route covers only part of the destination gas, the warning now asks for the shortfall rather than the whole cost, so a receiver who holds enough to close the gap is no longer flagged.
