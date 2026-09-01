---
"@lifi/widget": minor
---

Show a green checkmark next to verified tokens in the token list. The token verification badge now follows the API `verificationStatus` field instead of the `tokens.verified` config flag alone: `verified` tokens get a green check with the verifying provider in the tooltip, `flagged` tokens get a red warning, and unverified tokens keep the existing warning unless the integrator allowlisted them. Flagged native gas tokens stay unbadged, because the screening provider treats the native token address convention as a scam on some chains. The chain's native gas token now gets its own blue check and takes precedence over the screening verdict, because the provider screens the native-token address convention and reports a false positive on some chains.
