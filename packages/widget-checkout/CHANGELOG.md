# @lifi/widget-checkout

## 4.0.0

### Minor Changes

- [#817](https://github.com/lifinance/widget/pull/817) [`682e043`](https://github.com/lifinance/widget/commit/682e0430644efc6f4463cb5e016f7f2f21078220) Thanks [@chybisov](https://github.com/chybisov)! - Add quote-aware Transak checkout wiring by introducing onramp fiat-currencies and quote API contracts, extending onramp session payload/response fields, and carrying provider funding session metadata through checkout session state.

  Switch checkout cash funding to a fiat-first flow with live quote-driven route amounts, dynamic fiat currencies/payment methods, and persisted funding session ids for resume/reconciliation paths.

- [#817](https://github.com/lifinance/widget/pull/817) [`682e043`](https://github.com/lifinance/widget/commit/682e0430644efc6f4463cb5e016f7f2f21078220) Thanks [@chybisov](https://github.com/chybisov)! - Add the deposit/progress flow to checkout: transfer deposit page, progress page and deposit error pages, wired into the router.

- [#817](https://github.com/lifinance/widget/pull/817) [`682e043`](https://github.com/lifinance/widget/commit/682e0430644efc6f4463cb5e016f7f2f21078220) Thanks [@chybisov](https://github.com/chybisov)! - Restrict checkout to EVM chains and tokens, and hide the native gas token in deposit flows.

  Checkout now forces `chains.types` to EVM-only, so chain lists, token lists, route quotes, and wallet/recipient selection surface only EVM chains and their native + ERC20 tokens. The native gas token is hidden from source-token selection in the transfer/exchange/cash (Intent Factory) flows, which cannot accept it; the wallet flow keeps full token support.

  `@lifi/widget`'s wallet menu now honors the `chains.types` allow/deny config, so a restricted ecosystem set only offers wallets for the allowed chain types.

- [#817](https://github.com/lifinance/widget/pull/817) [`682e043`](https://github.com/lifinance/widget/commit/682e0430644efc6f4463cb5e016f7f2f21078220) Thanks [@chybisov](https://github.com/chybisov)! - Let users reconnect previously linked exchange accounts and set their own destination address in the checkout flow.

- [#817](https://github.com/lifinance/widget/pull/817) [`682e043`](https://github.com/lifinance/widget/commit/682e0430644efc6f4463cb5e016f7f2f21078220) Thanks [@chybisov](https://github.com/chybisov)! - Auto-resume a single in-flight checkout deposit on the funding screen, abandon a transfer from the back button (with confirmation), and surface checkout-specific route-not-found copy. Add state-aware status step labels, fail resumed exchange records that lost their session, and hide the redundant token subtext under the cash pay field.

- [#817](https://github.com/lifinance/widget/pull/817) [`682e043`](https://github.com/lifinance/widget/commit/682e0430644efc6f4463cb5e016f7f2f21078220) Thanks [@chybisov](https://github.com/chybisov)! - Add the `@lifi/widget-checkout` package scaffolding, providers, stores and the source/amount selection flow (select source, token and cash currency, enter amount, route selection).

- [#817](https://github.com/lifinance/widget/pull/817) [`682e043`](https://github.com/lifinance/widget/commit/682e0430644efc6f4463cb5e016f7f2f21078220) Thanks [@chybisov](https://github.com/chybisov)! - Fix wallet-flow resume to poll the correct status identifier and re-attach in-flight routes.

  A resumed wallet payment now polls by the right identifier: relayer/gasless routes carry a `taskId`, which is distinct from a `txHash` in the SDK status API and was previously polled as a hash (so it never resolved). A still-executing wallet route is now resumed through the SDK on the transaction page, so it prompts for any remaining user action (a second source-chain signature, a destination-chain claim) instead of sitting on a status page it cannot advance. Routes evicted from the route store are re-seeded from the persisted snapshot before resuming.

  `@lifi/widget` exports `isRouteActive`, `isRouteDone`, `isRouteFailed`, and the route-execution store accessors from `@lifi/widget/shared`.

- [#817](https://github.com/lifinance/widget/pull/817) [`682e043`](https://github.com/lifinance/widget/commit/682e0430644efc6f4463cb5e016f7f2f21078220) Thanks [@chybisov](https://github.com/chybisov)! - Checkout: quote through the shared `useRoutes` engine, and replace auto-resume with a pending/failed deposit activity list.

  - `useRoutes` gains an optional `quoteFromAddress` to quote before a wallet is connected (used as a non-signing placeholder), and no longer disables itself for custom deposit mode when it carries no contract calls. Checkout now delegates to `useRoutes` instead of a parallel implementation, correcting slippage, dynamic fee, and destination-ecosystem handling on walletless quotes.
  - Checkout no longer deep-resumes on mount. It always opens on the funding screen and surfaces live pending/failed deposits as a tappable activity list, polling each by deposit address to reconcile done (cleared) and failed (kept, dismissible) states. Pending records are re-keyed by a stable per-deposit id so distinct deposits no longer collide.

- [#817](https://github.com/lifinance/widget/pull/817) [`682e043`](https://github.com/lifinance/widget/commit/682e0430644efc6f4463cb5e016f7f2f21078220) Thanks [@chybisov](https://github.com/chybisov)! - Add the checkout transaction status, details and status-screen pages (execution status, step list, transfer details), completing the router.

- [#817](https://github.com/lifinance/widget/pull/817) [`682e043`](https://github.com/lifinance/widget/commit/682e0430644efc6f4463cb5e016f7f2f21078220) Thanks [@chybisov](https://github.com/chybisov)! - Let the wallet checkout flow use any available route instead of only the Intent Factory route. Wallet payments now quote across all integrator-allowed exchanges, with activity tracking and resume falling back to tx-hash status polling when a route has no deposit address. The deposit-based flows (transfer, exchange, cash) keep their Intent Factory restriction.

  In the wallet flow, the destination now defaults to the connected wallet (matching the destination ecosystem) when the integrator leaves the recipient user-settable, so users no longer have to fill in the "where to send it" field manually. The field stays editable, and a cross-ecosystem destination still falls back to manual entry.

### Patch Changes

- [#828](https://github.com/lifinance/widget/pull/828) [`1c6f5a2`](https://github.com/lifinance/widget/commit/1c6f5a235ec6347fd045c14d8cea4444c1e2eb84) Thanks [@chybisov](https://github.com/chybisov)! - chore: bump dependencies to their latest versions

  Upgrade to TypeScript 7 and refresh runtime dependency ranges: `viem`, `@bigmi/*`, `i18next`, `react-i18next`, `react-intersection-observer`, `@mysten/sui`, `@meshconnect/web-link-sdk`, and the `@lifi/sdk-provider-*` packages. Aligns the `@bigmi/react` range across `@lifi/widget-provider-bitcoin` and `@lifi/widget-light` so a single `@bigmi/client` copy is resolved.

- [#817](https://github.com/lifinance/widget/pull/817) [`682e043`](https://github.com/lifinance/widget/commit/682e0430644efc6f4463cb5e016f7f2f21078220) Thanks [@chybisov](https://github.com/chybisov)! - Harden the checkout deposit and status flows against errors and transient states.

  - Latch the last real deposit-address status so a regressive `NOT_FOUND` (e.g. the simulation-failure to refund path) no longer collapses a refund or executing screen back to "watching".
  - A resumed deposit with a deposit address keeps watching on `NOT_FOUND` instead of being dropped and bounced to amount entry: a just-started deposit that isn't indexed yet stays recoverable.
  - Surface failed session, step-transaction, and status-poll calls as a retryable error screen (or a retry CTA) instead of stranding on a disabled button or an endless spinner.
  - Cancelling an on-ramp provider pops the status entry instead of stacking a duplicate amount screen, so the first Back press is no longer a no-op.
  - Deposit transfers always hand off to the status page by deposit address, never by a tx hash, so a refund can't land on a misleading tx-hash status that 404-loops.

- [#817](https://github.com/lifinance/widget/pull/817) [`682e043`](https://github.com/lifinance/widget/commit/682e0430644efc6f4463cb5e016f7f2f21078220) Thanks [@chybisov](https://github.com/chybisov)! - Polish the checkout flow and align it with the main widget design.

  - Cards follow the widget's theme: receive/handoff cards use the shared border radius (so custom shapes like windows95 apply), the from/to token icons and labels line up, and the header back button aligns with page content.
  - The refresh-quotes button now refetches, and the checkout route query keeps its previous result so amount/fee values update in place on refresh and on token/amount changes instead of flashing a skeleton or resetting to zero.
  - Remove the funding-screen activity cards and stop surfacing the Mesh error on the choose-funding-source page.
  - Reuse the widget's send-to-wallet card for the checkout recipient (gated read-only for fixed recipients), and reuse the shared step link styling on the status page.
  - A quote with no deposit address is treated as unavailable instead of a silently disabled button, and going back from the amount screen no longer returns to the set-destination screen.
  - Cash deposit card: move the disclaimer inside the card, smooth the expand animation, and tighten the amount-to-fees spacing.
  - Show the Transak modal close button immediately, and prevent selecting the destination token as the source token.

  `@lifi/widget` exposes `SendToWalletButton` (with optional `onEditAddress`/`onClearAddress` overrides and a `requireAddress` flag), `BookmarkStoreProvider`, and the step `ExternalLink` via `@lifi/widget/shared`, and `useRoutes` gains an opt-in `keepPreviousData`.

- Updated dependencies [[`682e043`](https://github.com/lifinance/widget/commit/682e0430644efc6f4463cb5e016f7f2f21078220), [`1c6f5a2`](https://github.com/lifinance/widget/commit/1c6f5a235ec6347fd045c14d8cea4444c1e2eb84), [`682e043`](https://github.com/lifinance/widget/commit/682e0430644efc6f4463cb5e016f7f2f21078220), [`682e043`](https://github.com/lifinance/widget/commit/682e0430644efc6f4463cb5e016f7f2f21078220), [`682e043`](https://github.com/lifinance/widget/commit/682e0430644efc6f4463cb5e016f7f2f21078220), [`682e043`](https://github.com/lifinance/widget/commit/682e0430644efc6f4463cb5e016f7f2f21078220), [`682e043`](https://github.com/lifinance/widget/commit/682e0430644efc6f4463cb5e016f7f2f21078220), [`682e043`](https://github.com/lifinance/widget/commit/682e0430644efc6f4463cb5e016f7f2f21078220), [`682e043`](https://github.com/lifinance/widget/commit/682e0430644efc6f4463cb5e016f7f2f21078220), [`682e043`](https://github.com/lifinance/widget/commit/682e0430644efc6f4463cb5e016f7f2f21078220)]:
  - @lifi/widget-provider@4.3.0
  - @lifi/widget-provider-mesh@4.0.0
  - @lifi/widget@4.4.0
  - @lifi/wallet-management@4.1.2
