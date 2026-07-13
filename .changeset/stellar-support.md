---
"@lifi/widget-provider-stellar": minor
"@lifi/widget-provider": minor
"@lifi/wallet-management": minor
"@lifi/widget": minor
---

Add Stellar (STL) wallet support. Introduces the `@lifi/widget-provider-stellar` package, which integrates the Stellar Wallets Kit (Freighter, xBull, Albedo, Lobstr, Rabet, Hana, and WalletConnect) and exposes the connected account and signer to the widget. Adds the base `StellarContext`, wires Stellar into wallet management (account aggregation, combined wallet list, and the connect menu), and enables the Stellar ecosystem in the widget's wallet providers. Stellar is not yet selectable as a route chain — that follows in a later change once transaction execution lands.
