---
"@lifi/widget": patch
"@lifi/wallet-management": patch
"@lifi/widget-checkout": patch
"@lifi/widget-provider": patch
"@lifi/widget-provider-bitcoin": patch
"@lifi/widget-provider-ethereum": patch
"@lifi/widget-provider-solana": patch
"@lifi/widget-provider-stellar": patch
"@lifi/widget-provider-sui": patch
"@lifi/widget-provider-tron": patch
---

Update `@lifi/sdk` to `^4.6.1` and each `@lifi/sdk-provider-*` package to its latest
release. Move `@creit.tech/stellar-wallets-kit` to `^2.6.0`, which requires
`@stellar/stellar-sdk` v17. No source change was needed. The widget never imports
`@stellar/stellar-sdk` directly, so the v17 renames and its switch from `Buffer` to
`Uint8Array` have no surface here.

If you pin `@creit.tech/stellar-wallets-kit` yourself, move to `^2.6.0`. The kit keeps
wallet state in module level signals, so a second copy in the tree fails with "Please
set the wallet first".

`@mysten/sui` moves to `^2.27.0` because `@lifi/sdk-provider-sui@4.1.10` requires it. A
lower range lets a fresh install resolve two copies, which breaks the Sui provider types.

`@stellar/stellar-sdk` also drops from two copies to one. SWK `2.6.0` no longer pulls
`@trezor/connect-plugin-stellar`, which removes the subtree that asked for `14.2.0`, and
the remaining copy moves to `17.0.1`.
