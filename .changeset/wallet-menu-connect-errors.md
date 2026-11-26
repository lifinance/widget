---
"@lifi/wallet-management": patch
"@lifi/widget-provider": minor
"@lifi/widget-provider-solana": patch
---

Show why a wallet connection failed in the wallet menu, and probe Stellar wallets again when the menu opens (new optional `refreshWallets` on the provider context). The Solana provider's `connect` now rejects with the wallet's error instead of resolving.
