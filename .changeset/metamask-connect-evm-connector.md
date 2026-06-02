---
"@lifi/widget-provider-ethereum": patch
"@lifi/wallet-management": patch
---

Load the MetaMask Connect EVM (SDK) connector even when the extension is installed, so MetaMask connections route through the SDK consistently across desktop and mobile. The wallet picker keeps a single MetaMask entry, and the SDK connector is tagged as installed when the extension is detected.
