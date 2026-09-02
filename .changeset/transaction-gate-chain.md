---
"@lifi/widget": patch
---

Stop a confirmation sheet from skipping the sheets behind it. Continuing past the low-activity-address warning went straight to execution, so a route that was both going to a low-activity address and losing significant value never showed the high-value-loss warning. The same held on the retry path. Each sheet now resumes the chain at the gate after its own, and the order lives in one place instead of being re-decided by every sheet.
