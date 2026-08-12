---
'@lifi/widget': minor
'@lifi/widget-provider': minor
'@lifi/widget-provider-transak': minor
'@lifi/widget-provider-mesh': minor
---

Checkout runs on the unified funding-orders SDK surface. `useRoutes` accepts a per-request `allowExchanges` filter. `OnRampOpenArgs` gains `widgetUrl`/`linkToken`; the Transak and Mesh hosts no longer perform session HTTP. The checkout session client (`postCheckoutSession`) and its `/v1/checkout/*` types are removed from `@lifi/widget-provider/checkout`; `CheckoutContextValue.apiUrl` and `resumePending` are removed (deposits resume from live funding-order state, not a config flag). `onSuccess`/`onError` now fire on terminal funding-order state for all funding sources.
