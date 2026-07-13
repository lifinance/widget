---
"@lifi/widget-checkout": patch
"@lifi/widget": patch
---

Polish the checkout flow and align it with the main widget design.

- Cards follow the widget's theme: receive/handoff cards use the shared border radius (so custom shapes like windows95 apply), the from/to token icons and labels line up, and the header back button aligns with page content.
- The refresh-quotes button now refetches, and the checkout route query keeps its previous result so amount/fee values update in place on refresh and on token/amount changes instead of flashing a skeleton or resetting to zero.
- Remove the funding-screen activity cards and stop surfacing the Mesh error on the choose-funding-source page.
- Reuse the widget's send-to-wallet card for the checkout recipient (gated read-only for fixed recipients), and reuse the shared step link styling on the status page.
- A quote with no deposit address is treated as unavailable instead of a silently disabled button, and going back from the amount screen no longer returns to the set-destination screen.
- Cash deposit card: move the disclaimer inside the card, smooth the expand animation, and tighten the amount-to-fees spacing.
- Show the Transak modal close button immediately, and prevent selecting the destination token as the source token.

`@lifi/widget` exposes `SendToWalletButton` (with optional `onEditAddress`/`onClearAddress` overrides and a `requireAddress` flag), `BookmarkStoreProvider`, and the step `ExternalLink` via `@lifi/widget/shared`, and `useRoutes` gains an opt-in `keepPreviousData`.
