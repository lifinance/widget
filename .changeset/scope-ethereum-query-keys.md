---
'@lifi/widget': patch
---

Namespace address-activity and contract-code React Query keys with the widget key prefix so they cannot collide with integrator queries when a host QueryClient is reused.
