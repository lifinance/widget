---
"@lifi/widget-checkout": patch
---

Harden the checkout deposit and status flows against errors and transient states.

- Latch the last real deposit-address status so a regressive `NOT_FOUND` (e.g. the simulation-failure to refund path) no longer collapses a refund or executing screen back to "watching".
- A resumed deposit with a deposit address keeps watching on `NOT_FOUND` instead of being dropped and bounced to amount entry: a just-started deposit that isn't indexed yet stays recoverable.
- Surface failed session, step-transaction, and status-poll calls as a retryable error screen (or a retry CTA) instead of stranding on a disabled button or an endless spinner.
- Cancelling an on-ramp provider pops the status entry instead of stacking a duplicate amount screen, so the first Back press is no longer a no-op.
- Deposit transfers always hand off to the status page by deposit address, never by a tx hash, so a refund can't land on a misleading tx-hash status that 404-loops.
