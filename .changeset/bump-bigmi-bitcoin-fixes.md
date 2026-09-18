---
'@lifi/widget-provider-bitcoin': patch
'@lifi/widget-light': patch
---

Require `@bigmi/client` 0.10.3, `@bigmi/core` 0.9.2 and `@bigmi/react` 0.9.3. The client release detects BitKeep when it injects only as `window.unisat`, which connector-backed wallet detection needs in order not to narrow. The core release reports a declined confirmation as a user rejection even when the wallet sends no rejection code, so a cancelled MetaMask Bitcoin signature now reads "Signature required" instead of "Unknown Error".
