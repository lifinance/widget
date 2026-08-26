---
'@lifi/widget-provider-stellar': patch
---

Keep the Stellar Wallets Kit off the server render. The kit's wallet modules read `window` in their constructors, so a framework that server-renders the provider — Next.js prerendering, for example — crashed with `ReferenceError: window is not defined` inside `initStellarWalletsKit`. Without a `window` the store is now built inert: no kit, no availability probe, no listeners. The browser still builds the real singleton in its own module instance, and because its first render also shows no wallets and no address, hydration stays consistent.
