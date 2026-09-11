---
"@lifi/widget": minor
"@lifi/widget-checkout": minor
---

Explain why a quote returned no routes instead of showing one generic sentence: the widget now ranks the API's own filter and tool-error reasons and shows the one blocking the route, offering a one-click fix where it can derive one, such as raising the amount or moving slippage to what the routes accept. An unrecognised reason still renders the existing generic message, the no-routes state now waits for an in-flight gasless quote before it reports, and in `mode: 'custom'` a contract-call quote that 404s shows the no-routes screen rather than an error state.
