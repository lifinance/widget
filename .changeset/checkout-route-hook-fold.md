---
'@lifi/widget': minor
'@lifi/widget-checkout': minor
---

Checkout: quote through the shared `useRoutes` engine, and replace auto-resume with a pending/failed deposit activity list.

- `useRoutes` gains an optional `quoteFromAddress` to quote before a wallet is connected (used as a non-signing placeholder), and no longer disables itself for custom deposit mode when it carries no contract calls. Checkout now delegates to `useRoutes` instead of a parallel implementation, correcting slippage, dynamic fee, and destination-ecosystem handling on walletless quotes.
- Checkout no longer deep-resumes on mount. It always opens on the funding screen and surfaces live pending/failed deposits as a tappable activity list, polling each by deposit address to reconcile done (cleared) and failed (kept, dismissible) states. Pending records are re-keyed by a stable per-deposit id so distinct deposits no longer collide.
