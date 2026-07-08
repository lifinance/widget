---
'@lifi/widget-provider': minor
'@lifi/widget-provider-transak': minor
'@lifi/widget-provider-mesh': minor
'@lifi/widget-checkout': minor
'@lifi/widget': minor
---

Add quote-aware Transak checkout wiring by introducing onramp fiat-currencies and quote API contracts, extending onramp session payload/response fields, and carrying provider funding session metadata through checkout session state.

Switch checkout cash funding to a fiat-first flow with live quote-driven route amounts, dynamic fiat currencies/payment methods, and persisted funding session ids for resume/reconciliation paths.
