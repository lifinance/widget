---
'@lifi/widget-provider-bitcoin': patch
'@lifi/widget-light': minor
---

Require `@bigmi/client` 0.10.4, `@bigmi/core` 0.9.2 and `@bigmi/react` 0.9.4. The client release detects BitKeep when it injects only as `window.unisat`, which connector-backed wallet detection needs in order not to narrow. The core release reports a declined confirmation as a user rejection even when the wallet sends no rejection code, so a cancelled MetaMask Bitcoin signature now reads "Signature required" instead of "Unknown Error". The 0.10.4 client additionally fixes Binance detection when `window.binancew3w` carries no bitcoin provider, stops MetaMask Bitcoin opening the extension on page load, and keeps the store consistent when a wallet's own `disconnect()` throws.
