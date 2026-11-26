---
"@lifi/widget-provider-stellar": patch
---

Use the Varial (formerly Freighter) wallet module and restore sessions saved under the old Freighter id. A wallet on the wrong Stellar network no longer shows as connected, detected wallets stay in the menu, the pre-signing wallet check waits up to 3 seconds, a Varial signature from an account other than the requested one is rejected, and a connect that a newer connect replaced now rejects.
