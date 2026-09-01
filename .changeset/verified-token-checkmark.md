---
"@lifi/widget": minor
---

Drive the token badge from the API `verificationStatus` field. A verified token shows a green check naming the provider that verified it, a flagged token shows a red warning, and an unverified token shows nothing: the absence of a verdict is not a finding. The chain's native token shows a blue check ahead of any verdict, because the screening provider treats the native-token address convention as a scam on some chains. The native token also leads its own chain's list unless the integrator or the user already placed it. Hyperliquid and Lighter are excluded from the native badge: both declare a bridged stablecoin from another chain as their native token, so there is no gas token to mark there.

`tokens.verified` and `tokens.include` keep their meaning, but the main token list no longer marks every token it returns as verified. That marking predated `verificationStatus` and made the flag mean "came from the main list"; tokens from the list now carry `listed` instead, and `verified` means only what the config sets.
