---
"@lifi/widget": minor
"@lifi/widget-checkout": minor
---

Explain why a quote returned no routes instead of showing one generic sentence. The widget ranks the API's own filter and tool-error reasons, including the reasons partners state in their own error text, and shows the one that blocks the route as a card. Where the user can act on it, the card offers one button that names what it sets, such as "Use 2.1 USDC" or "Set slippage to 0.8%". It never asks for a change the user cannot make, such as a locked amount or a receiver that cannot be cleared. An unrecognised reason still shows the existing generic message.

The no-routes answer no longer waits for a relayer quote. A route that the relayer brings later replaces it, but only for the request still on screen. In `mode: 'custom'`, a contract-call quote that answers 404 with diagnostics shows the no-routes screen rather than an error state; the diagnostics are read from `errors`, or from JSON inside `message`. The routes page keeps the answer on screen through a refresh, and in the wide layout the limit page no longer shows the card twice.
