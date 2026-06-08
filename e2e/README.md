# LI.FI Widget — E2E Tests

Playwright TypeScript E2E tests for the LI.FI Widget. Two independent suites share this directory:

| Suite | Config | Targets | CI workflow |
|---|---|---|---|
| **Playground** | `playwright.config.ts` | Widget Playground app | `e2e-playground.yml` |
| **Examples** | `playwright.examples.config.ts` | 17 active example apps | `e2e-examples.yml` |

---

## Setup

```bash
# From repo root — installs everything
pnpm install

# Install Playwright browsers (once, or after Playwright version bumps)
pnpm --filter @lifi/widget-e2e exec playwright install chromium
```

---

## Playground tests

Tests for the widget playground sidebar settings and their effect on the widget.
**162 tests across 11 spec files.** 3 tests are intentionally failing (they guard open bug-fix PRs).

→ **[Full playground test documentation](./README.playground.md)**

**Quick start:**

```bash
# Terminal 1 — start dev server
pnpm dev   # http://localhost:3000

# Terminal 2 — run all playground tests
cd e2e
pnpm exec playwright test --project dev
```

> **`pnpm exec` requires the `e2e/` directory.** The Playwright binary belongs to the `@lifi/widget-e2e` package, so `pnpm exec playwright …` only resolves from inside `e2e/`. From the repo root, use the filter form instead: `pnpm --filter @lifi/widget-e2e exec playwright test --project dev` (as in [Setup](#setup) above).

---

## Examples tests

Smoke tests that verify all 17 active example apps render and function correctly.
**3–4 assertions per app** covering widget mount, heading, Settings view, and token selection.

→ **[Full examples test documentation](./README.examples.md)**

**Quick start:**

```bash
# From repo root — build packages + run all examples sequentially
pnpm test:examples

# Single example
pnpm test:example vite
```

---

## Architecture

Both suites use the **Component Object Model (COM)** — locators live in `tests/components/`, not scattered through specs.

```
e2e/
├── playwright.config.ts             # Playground: dev + preview projects
├── playwright.examples.config.ts    # Examples: one project per active example
├── examples.config.ts               # Source of truth for example metadata
├── examples.json                    # Derived from examples.config.ts (for CI scripts)
└── tests/
    ├── fixtures/base.fixture.ts     # Extended test with sidebar/exchange fixtures
    ├── components/
    │   ├── PlaygroundSidebar.ts     # All sidebar panels + locators
    │   ├── WidgetExchange.ts        # Widget: From/To/send/wallet/settings
    │   ├── TokenSelectorView.ts     # Token list and search
    │   ├── SettingsView.ts          # Settings rows and navigation
    │   └── WidgetSendToWalletView.ts
    ├── playground/                  # Playground spec files (11 files)
    └── profiles/                    # Example app spec files (3 profiles)
```

### Reporters

| Environment | Reporters |
|---|---|
| **Local** | HTML report (`playwright-report/`) + list |
| **CI** | Blob per shard (merged after) + list |

On CI, blob reports from each shard are merged into a single HTML report uploaded as a workflow artifact.

### Selector strategy — priority order

1. **`aria-label`** — stable, semantic, preferred when already on the element
2. **Role + name** — `getByRole('button', { name: '...' })`; use `exact: true`
3. **Visible text** — for headings and labels with no role
4. **`data-testid`** — when no accessible hook exists; add to source, never for aria replacement
5. **CSS selector** — last resort for container elements

Never use MUI-generated class names — they change between builds.
