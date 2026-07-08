---
"@lifi/widget-checkout": minor
"@lifi/widget": minor
---

Restrict checkout to EVM chains and tokens, and hide the native gas token in deposit flows.

Checkout now forces `chains.types` to EVM-only, so chain lists, token lists, route quotes, and wallet/recipient selection surface only EVM chains and their native + ERC20 tokens. The native gas token is hidden from source-token selection in the transfer/exchange/cash (Intent Factory) flows, which cannot accept it; the wallet flow keeps full token support.

`@lifi/widget`'s wallet menu now honors the `chains.types` allow/deny config, so a restricted ecosystem set only offers wallets for the allowed chain types.
