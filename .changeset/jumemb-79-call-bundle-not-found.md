---
"@lifi/widget": patch
"@lifi/widget-checkout": patch
---

After a wallet rejects a batched swap and the page reloads, the failed route shows why it cannot continue. When the wallet has no record of a batched transaction, the failed route offers "Delete" and "Start a new swap". It does not offer "Try again", because "Try again" waits for the same transaction again. "Start a new swap" fills the form with the same swap. If the widget cannot start the same swap again, the failed route offers only "Delete".
