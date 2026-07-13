---
"@lifi/widget-checkout": minor
---

Let the wallet checkout flow use any available route instead of only the Intent Factory route. Wallet payments now quote across all integrator-allowed exchanges, with activity tracking and resume falling back to tx-hash status polling when a route has no deposit address. The deposit-based flows (transfer, exchange, cash) keep their Intent Factory restriction.

In the wallet flow, the destination now defaults to the connected wallet (matching the destination ecosystem) when the integrator leaves the recipient user-settable, so users no longer have to fill in the "where to send it" field manually. The field stays editable, and a cross-ecosystem destination still falls back to manual entry.
