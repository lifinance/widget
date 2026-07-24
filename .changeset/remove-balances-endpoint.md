---
"@lifi/widget": minor
---

Token balances are now fetched exclusively from RPCs — the deprecated `/balances` API endpoint is no longer used to prefilter token lists. Wallet-held tokens outside the curated token list no longer auto-appear in "My Tokens"; they can still be found via address search. In the all-networks view, balances now reveal in a single sorted pass instead of reordering the list as each chain resolves.
