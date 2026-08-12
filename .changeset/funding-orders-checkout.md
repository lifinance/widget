---
'@lifi/widget': minor
'@lifi/widget-provider': minor
'@lifi/widget-provider-transak': minor
'@lifi/widget-provider-mesh': minor
---

**Breaking for @lifi/widget-provider consumers despite the minor bump:** `postCheckoutSession`, the `/v1/checkout/*` session types, `CheckoutContextValue.apiUrl`, and `resumePending` are removed from `@lifi/widget-provider/checkout` without deprecation.

Checkout runs on the unified funding-orders SDK surface. `useRoutes` accepts a per-request `allowExchanges` filter. `OnRampOpenArgs` gains `widgetUrl`/`linkToken`; the Transak and Mesh hosts no longer perform session HTTP. `onSuccess`/`onError` now fire on terminal funding-order state for all funding sources.
