# LI.FI Widget — E2E Test Suite

Playwright TypeScript E2E tests for the LI.FI Widget playground
(`packages/widget-playground-vite`).

## Prerequisites

- Node.js ≥ 18
- pnpm ≥ 9
- Widget playground running locally (`pnpm dev` from the repo root — serves on port 3000)

## Setup

```bash
# From this directory (e2e/)
pnpm install
pnpm exec playwright install chromium
```

> The `e2e/` directory is intentionally outside the monorepo workspace.
> A local `.npmrc` sets `ignore-workspace=true` so `pnpm install` always
> installs deps into `e2e/node_modules` without needing any extra flags.

## Running Tests

| Command | Description |
|---|---|
| `pnpm smoketest` | Smoke suite only - fastest CI gate |
| `pnpm test` | Full test suite |
| `pnpm test:headed` | Run with visible browser |
| `pnpm test:debug` | Playwright debug inspector |
| `pnpm test:ui` | Playwright interactive UI |
| `pnpm typecheck` | TypeScript type-check (no emit) |
| `pnpm report` | Open last HTML report |

## Environment Variables

Copy `.env.test.example` to `.env.test` and adjust as needed:

```bash
cp .env.test.example .env.test
```

| Variable | Default | Description |
|---|---|---|
| `BASE_URL` | `http://localhost:3000` | Playground URL — override for staging/prod runs |

## Architecture

### Pattern: Component Object Model (COM)

The widget is a single-page component with internal navigation (TanStack Router) that
does **not** change the URL on view transitions. A traditional Page Object Model with
URL-based page boundaries doesn't apply. Instead, each widget *view* (Exchange, Token
Selector, Settings) has its own Component Object encapsulating its selectors and
interactions.

```
tests/
├── fixtures/
│   └── base.fixture.ts       # Extends Playwright test with widget fixtures + waitForTokens()
├── components/
│   ├── PlaygroundSidebar.ts  # Left sidebar: Design/Code tabs, variant controls
│   ├── WidgetExchange.ts     # Exchange view: From/To buttons, Settings icon, Send input
│   ├── TokenSelectorView.ts  # Token list (listitem rows), search input, chain sidebar
│   └── SettingsView.ts       # Settings rows, back navigation
└── smoke/
    └── smoke.spec.ts         # Smoke tests for quick UI verification
```

### Selector Strategy

| ✅ Use | ❌ Avoid |
|---|---|
| `getByRole('button', {name: '...'})` | CSS class names (MUI generates dynamic names) |
| `getByText()` for stable visible text | `id*="widget-"` suffix — varies per build session |
| `locator('[id^="widget-app-expanded-container"]')` for widget root | `locator('main')` — only exists in the playground, not in example apps |
| `locator('p', {hasText: /^Exchange$/})` for headings | `getByRole('paragraph')` — `<p>` has no implicit ARIA role |
| `getByRole('list').locator('listitem')` for token rows | Positional index assumptions in non-searched token lists |

**Widget root selector:** The widget renders into `<div id="widget-app-expanded-container-{suffix}">`.
The suffix varies per build session, so always use the starts-with attribute selector:
`page.locator('[id^="widget-app-expanded-container"]')`. This selector works in both
the playground (`<main>` → widget) and any example app (`<div id="root">` → widget directly).
**Never use `locator('main')`** — it is playground-specific and will not match widget content
in example apps (`examples/vite`, `examples/next`, etc.).

**Key pitfall:** The widget header's back button and Settings button
are siblings. `querySelector('[id*="widget-header"] button')` grabs the first button
(often the wrong one). Use `getByRole('button', {name: 'Settings', exact: true})`.

### Token Selection

The widget fetches the token list on page load (not on selector open) via:

```
GET https://li.quest/v1/tokens?chainTypes=EVM,SVM,UTXO,MVM&...
```

Before interacting with the token selector, wait for this response to ensure the list is
populated. Use `waitForTokens(page)` exported from `base.fixture.ts`, paired with
`page.goto()` in a `Promise.all` so the response is never missed:

```typescript
import { waitForTokens } from '../fixtures/base.fixture.js'

await Promise.all([waitForTokens(page), page.goto('/')])
```

All items in the token list are real clickable token rows (each is a `listitem` containing
a `button`). Use `tokenSelector.selectFirstToken()` or `tokenSelector.selectTokenByIndex(n)`
from `TokenSelectorView`. After clicking a token the widget automatically navigates back
to the Exchange view — no explicit back-navigation needed.

> **Note:** The `@example` tests do **not** require `buildUrl: true` in widget configs.
> Never add `buildUrl: true` to example apps for testing purposes.

## Smoke Tests

All smoke tests run with `pnpm smoketest`.

| # | Test | What it verifies |
|---|---|---|
| 1 | Playground sidebar visible | LI.FI Widget heading · Design/Code tabs · Variant/Subvariant controls |
| 2 | Widget container displayed | Widget root (`[id^="widget-app-expanded-container"]`) visible · Exchange heading · From/To buttons · Send amount input |
| 3 | Settings accessible | Cog icon opens Settings · all setting rows visible · back returns to Exchange |
| 4 | Token route setup | Waits for token list API · opens From selector · selects first token · opens To selector · selects second token · Exchange view reflects both selections |

## Test Results

Results are written to `playwright-report/` (HTML) and `test-results/results.json`.

Failures include screenshot, video, and trace attachments in `test-results/`.

```bash
# View trace for a failing test
pnpm exec playwright show-trace test-results/<test-dir>/trace.zip
```

## Example Compatibility

The `@example` tests (tagged `@example` in `smoke.spec.ts`) are designed to run against
any widget example app. They do **not** require any source code changes to the example apps —
no `buildUrl: true` or other config additions needed.

### Compatible (pass all @example tests)

| Example | Notes |
|---|---|
| vite | Reference target |
| connectkit | ✅ |
| nextjs | ✅ |
| nextjs15 | ✅ |
| privy | ✅ |
| privy-ethers | ✅ |
| rainbowkit | ✅ |
| reown | ✅ |
| svelte | ✅ |
| zustand-widget-config | ✅ after scoping `fromButton`/`toButton` to `widgetRoot` (sidebar had extra From/To buttons causing strict mode violations) |

### Incompatible — requires separate test approach

| Example | Reason |
|---|---|
| deposit-flow | `subvariant: 'custom'` renders "Deposit" heading, not "Exchange" |
| nft-checkout | `subvariant: 'custom'` renders NFT checkout UI, not "Exchange" |
| tanstack-router | Widget renders at `/widget` route, not `/` |
| vite-iframe | Widget inside `<iframe>` — requires `page.frameLocator()` |
| vite-iframe-wagmi | Same iframe isolation |
| vue | React-in-Vue wrapper (veaury) — widget root ID not found in DOM |
| dynamic | Requires wallet auth init before widget renders |

### Build or serve failures (not test issues)

| Example | Issue |
|---|---|
| nextjs14 | `@metamask/connect-evm` missing |
| nextjs14-page-router | Same missing dependency |
| nuxt | Rollup SSR polyfill error (`isIP` not exported) |
| react-router-7 | ESM directory import rejected (`use-sync-external-store/shim`) |
| remix | Same ESM issue |

### Skipped

| Example | Reason |
|---|---|
| nextjs-page-router | No `package.json` — empty directory |

---

## Known Findings / Notes

- **No `data-testid` attributes** exist in the widget codebase (only a handful of
  `aria-label` attributes). All selectors rely on ARIA roles and visible text — this
  means selector updates may be needed if i18n strings change.
- The widget's `<p>` heading elements (`Exchange`, `Settings`) have **no implicit ARIA
  role** in Playwright's accessibility model. Use `locator('p', {hasText: ...})` instead
  of `getByRole('paragraph')`.
- In Wide variant (default), the token selector opens a **second panel** (chain sidebar)
  to the right. The first `getByRole('list')` is the token list; the second is the
  chain sidebar.
- The token list (without a wallet connection) contains only real clickable token rows —
  no section headers like "Pinned tokens" / "All tokens". Clicking by index (0 = first,
  1 = second, …) is safe. Tokens are ordered by 24 h volume descending.
