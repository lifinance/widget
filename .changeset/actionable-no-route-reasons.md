---
"@lifi/widget": minor
---

Explain why a quote returned no routes instead of showing one generic sentence: the widget now ranks the API's own filter and tool-error reasons into cards, the top one offering a one-click fix such as raising the amount or loosening slippage. An unrecognised reason still renders the existing generic message, and in `mode: 'custom'` a contract-call quote that 404s now shows the no-routes screen rather than an error state.
