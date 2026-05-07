# LI.FI Widget — E2E Test Suite

Playwright TypeScript E2E tests for the LI.FI Widget. Two test suites share this directory:

| Suite | Config | What it tests |
|---|---|---|
| **Playground** | `playwright.config.ts` | Widget playground (`packages/widget-playground-vite`) |
| **Examples** | `playwright.examples.config.ts` | All example apps in `examples/` |

---

## Setup

Dependencies are installed automatically with `pnpm install` from the repo root.

```bash
# Install Playwright browsers (once, or after Playwright version bumps)
pnpm --filter @lifi/widget-e2e exec playwright install chromium
```

### Prerequisite: build workspace packages

Examples consume `@lifi/widget`, `@lifi/wallet-management`, etc. as workspace deps that resolve to `packages/*/dist`. Stale dist artifacts cause silent runtime failures (e.g. `Class extends value undefined …` when the widget mounts), so build packages before running the example suite:

```bash
# From repo root
pnpm -r --parallel --filter './packages/**' --filter '!*-playground-*' --filter '!*-embedded' build
```

CI runs the same command before tests.

---

## Playground Tests

The playground must be running before tests can execute.

```bash
# Terminal 1
pnpm dev   # starts widget-playground-vite on http://localhost:3000

# Terminal 2 — from repo root
pnpm smoketest   # playground smoke tests
```

From the `e2e/` directory:

| Command | Description |
|---|---|
| `pnpm test` | Full test suite |
| `pnpm smoketest` | Smoke tests only |
| `pnpm test:headed` | Visible browser |
| `pnpm test:debug` | Playwright debug inspector |
| `pnpm test:ui` | Playwright interactive UI |
| `pnpm report` | Open last HTML report |

---

## Example Tests

Each example is built, served, and tested in isolation. The local scripts handle the full lifecycle.

```bash
# From repo root

# Single example — build → serve → test → kill
pnpm test:example vite
pnpm test:example tanstack-router
pnpm test:example nft-checkout

# All 17 active examples sequentially
pnpm test:examples
```

Reports land in `e2e/playwright-report-examples/`.

### Active examples and their profiles

| Profile | Examples | What makes it different |
|---|---|---|
| `standard` | vite, connectkit, privy, privy-ethers, rainbowkit, reown, svelte, zustand-widget-config, vue, nextjs, nextjs15, remix, react-router-7 | Widget at `/`, Exchange heading |
| `routed` | tanstack-router | Widget at a custom route (`/widget`) |
| `iframe` | vite-iframe, vite-iframe-wagmi | Widget inside `<iframe>` via `LiFiWidgetLight`; loads from `https://widget.li.fi` |
| `nft` | nft-checkout | NFT checkout subvariant — Checkout heading, Pay with section |

### What each profile asserts

**standard / routed** — widget root visible, Exchange heading, From/To buttons, send amount input, Settings view opens with all rows, back navigation, token selector From/To end-to-end.

**iframe** — iframe present in DOM, widget root visible inside frame, Exchange heading inside frame, Settings button clickable inside frame.

**nft** — widget root visible, Checkout heading, Pay with section, no error boundary.

### Per-example build/serve notes

Most examples use the framework's standard preview command. A few quirks captured in `e2e/examples.config.ts`:

- **`buildCmd: 'vite-build'`** (instead of `'build'`) — used for examples whose `package.json` build script is `tsc && vite build`, where `tsc` currently fails due to a MUI v7 props vs. `@lifi/types` mismatch. We invoke Vite directly to skip the type check until upstream types catch up. Affects: `vite`, `connectkit`, `privy`, `privy-ethers`, `rainbowkit`, `reown`, `vite-iframe`, `dynamic`, `deposit-flow`.
- **`PORT` env var** — `remix` and `react-router-7` use `remix-serve` / `react-router-serve`, which honor `process.env.PORT` and otherwise pick the next free port. The script always sets `PORT` for these.
- **`nextjs` / `nextjs15`** — `next start` defaults to port 3000.
- **`nuxt`** — `nuxt preview` defaults to port 3000.

### Known broken examples (not tested)

> Fix these and flip `status: 'broken' → 'active'` in `e2e/examples.config.ts` to include them.

| Example | Issue | Ticket |
|---|---|---|
| `dynamic` | `vite-plugin-env-compatible` doesn't shim `process` globally — Dynamic SDK crashes at runtime | [EMB-349](https://linear.app/lifi-linear/issue/EMB-349) |
| `nuxt` | veaury's React bridge fails in Nuxt SSR production build (`R is not a function`) | [EMB-350](https://linear.app/lifi-linear/issue/EMB-350) |
| `deposit-flow` | Widget's own error boundary fires at runtime — root never mounts | [EMB-351](https://linear.app/lifi-linear/issue/EMB-351) |

### Stale directories (ignore)

`examples/nextjs14`, `examples/nextjs14-page-router`, and `examples/nextjs-page-router` have no `package.json` and are leftover scaffolding. They are not in `examples.config.ts` and are not built or tested.

### Adding a new example

1. Add an entry to `e2e/examples.config.ts` (the TypeScript source of truth)
2. Add the same entry to the case statement in `scripts/test-example.sh`
3. Add the name to `ACTIVE_EXAMPLES` in `scripts/test-all-examples.sh`
4. Add the name and metadata to the four lookup tables in `.github/workflows/e2e-examples.yml`

---

## Architecture

### Two configs, clean separation

`playwright.config.ts` runs the playground suite (`tests/playground/`). It ignores `tests/profiles/` entirely via `testIgnore`.

`playwright.examples.config.ts` generates one Playwright project per active example from `examples.config.ts`. Each project sets `baseURL` to the example's port and `testMatch` to its profile spec. No `webServer` — server lifecycle is managed externally by the scripts or CI.

### Component Object Model

The widget uses internal TanStack Router navigation that does not change the URL. A Page Object Model with URL-based boundaries doesn't apply. Each widget view has its own Component Object:

```
tests/
├── fixtures/
│   └── base.fixture.ts          # Extended test with widget fixtures + waitForTokens()
├── components/
│   ├── PlaygroundSidebar.ts     # Left sidebar: Design/Code tabs, variant controls
│   ├── WidgetExchange.ts        # Exchange view: From/To buttons, Settings icon, send input
│   ├── TokenSelectorView.ts     # Token list, chain sidebar
│   └── SettingsView.ts          # Settings rows, back navigation
├── playground/
│   └── smoke.spec.ts            # Playground smoke tests
└── profiles/
    ├── widget-smoke.spec.ts     # standard + routed (reads mountPath from project metadata)
    ├── iframe.spec.ts
    └── nft.spec.ts
```

### Selector strategy

| Use | Avoid |
|---|---|
| `getByRole('button', { name: '...' })` | CSS class names — MUI generates dynamic names |
| `locator('[id^="widget-app-expanded-container"]')` for widget root | `locator('main')` — playground-specific, absent in example apps |
| `locator('p', { hasText: /^Exchange$/ })` for headings | `getByRole('paragraph')` — `<p>` has no implicit ARIA role |
| `getByRole('list').locator('listitem')` for token rows | Positional index assumptions without prior search |

**Widget root:** `<div id="widget-app-expanded-container-{suffix}">` — the suffix varies per build session, always use the prefix selector `[id^="widget-app-expanded-container"]`.

### Token list

The widget fetches tokens on page load, not on selector open. Use `waitForTokens(page)` paired with `page.goto()` in a `Promise.all` to guarantee the response is captured:

```ts
await Promise.all([waitForTokens(page), page.goto('/')])
```

---

## CI

`e2e-examples.yml` triggers on every PR to `main`. The `detect-changes` job computes which examples to test:

- A change to `examples/<name>/` → runs that example only
- A change to `packages/widget/**`, `packages/wallet-management/**`, `packages/widget-provider*/**`, or `e2e/**` → runs all 17 examples

Each example runs as an isolated matrix job (parallel, `fail-fast: false`). If any example fails, a sticky comment is posted on the PR listing which ones failed with a link to the workflow run.
