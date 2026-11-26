---
"@lifi/widget-provider-stellar": patch
---

Use the Varial (formerly Freighter) wallet module and restore sessions saved under the Freighter id. Check the wallet's network before reporting a connection, and reject a Varial signature from an account other than the requested one. `connect` now rejects when a connect to another wallet replaces it.
