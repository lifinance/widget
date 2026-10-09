---
"@lifi/widget": patch
---

After a wallet rejects a batched swap and the page reloads, the failed route shows why it cannot continue. For this error, the failed route offers "Delete" and "Start a new swap". It does not offer "Try again", because the wallet has no record of the transaction. "Start a new swap" fills the form with the same swap. If the widget cannot start the same swap again, the failed route offers only "Delete".
