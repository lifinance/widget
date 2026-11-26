---
"@lifi/wallet-management": patch
"@lifi/widget-provider": minor
"@lifi/widget-provider-solana": patch
---

Show why a wallet connection failed in the wallet menu, and probe Stellar wallets again when the menu opens (new optional `refreshWallets` on the provider context). A connection that the user left for another wallet no longer closes the menu or shows its error when it ends later. The Solana provider's `connect` now rejects with the wallet's error instead of resolving.
