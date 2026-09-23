---
'@lifi/widget': patch
---

The token list no longer fails its first load when a second query shares its request. `getTokens` in `@lifi/sdk` shares one in-flight request between callers that ask for the same list, and that request carried the first caller's abort signal. When a changed `keyPrefix`, a second widget, or a React StrictMode remount cancelled the first query, the other failed with an AbortError and retried a second later, or, in a hidden page, showed an empty token list. The main token query no longer passes an abort signal, so the widget no longer aborts the shared request.
