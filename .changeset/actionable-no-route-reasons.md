---
"@lifi/widget": minor
"@lifi/widget-checkout": minor
---

Explain why a quote returned no routes instead of showing one generic sentence: the widget now ranks the API's own filter and tool-error reasons and shows the one blocking the route, offering a one-click fix where it can derive one, such as raising the amount or moving slippage to what the routes accept. An unrecognised reason still renders the existing generic message, the no-routes state now waits for an in-flight gasless quote before it reports, and in `mode: 'custom'` a contract-call quote that 404s shows the no-routes screen rather than an error state. The 404 diagnostics are read whether the backend returns them in `errors` or serialises them into `message`. A suggested amount is shown with digit grouping, and the card reports the limit a tool stated rather than promising a route exists at that figure. Where a figure is only the widget's own floor rather than one a tool stated, the card advises an amount to try instead of reporting a minimum it never saw. In the wide layout the limit page no longer shows the card twice: it leaves that card to the side panel while keeping its own route selector.
