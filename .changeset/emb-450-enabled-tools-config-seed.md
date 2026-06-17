---
'@lifi/widget': patch
---

Respect the integrator's `exchanges`/`bridges` allow-list on the first route request. Previously, before the `/tools` fetch populated the enabled-tools store, the initial `/advanced/routes` request omitted the exchange/bridge filter (or sent a stale persisted list), so it could return and render routes from disabled tools. The enabled-tools state is now seeded synchronously from the config allow-list and stale persisted entries are intersected against it on rehydration.
