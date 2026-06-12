# LI.FI Widget — E2E Tests

Playwright TypeScript E2E tests for the LI.FI Widget. Two test suites share this directory — the **Playground** suite (run in two modes) and the **Examples** suite:

| Suite | Config | Targets | CI workflow |
|---|---|---|---|
| **Playground** (preview) | `playwright.config.ts` | Widget Playground — production build (:4173) | `e2e-playground.yml` |
| **Playground** (dev smoke) | `playwright.dev.config.ts` | Widget Playground — vite dev server (:3000) | `e2e-playground-dev.yml` |
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

**Quick start:** (from the repo root — the server is started/stopped automatically)

```bash
pnpm e2e        # full suite, preview mode (production build at :4173) — matches CI
pnpm e2e:dev    # smoke subset, dev mode (vite dev server at :3000)
```

> No need to start a server or `cd` anywhere — each config's `webServer` builds/serves
> the playground and tears it down when finished, reusing one already running on the port.
> See [README.playground.md](./README.playground.md) for lower-level flags and dev/preview details.

Both modes gate PRs: `e2e-playground.yml` runs the full suite against the production build,
and `e2e-playground-dev.yml` runs the dev-mode smoke subset to guard the source-resolution
path (the dev server resolves `@lifi/widget` from source — a break the production build can't catch).

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
├── playwright.config.ts             # Playground preview mode (build + serve :4173)
├── playwright.dev.config.ts         # Playground dev mode (vite dev :3000) — smoke subset
├── playwright.examples.config.ts    # Examples: one project per active example
├── examples.config.ts               # Source of truth for example metadata
├── examples.json                    # Derived from examples.config.ts (for CI scripts)
└── tests/
    ├── fixtures/base.fixture.ts     # Extended test with sidebar/widget fixtures
    ├── components/
    │   ├── PlaygroundSidebar.ts     # All sidebar panels + locators
    │   ├── WidgetView.ts            # Widget main view: From/To/send/wallet/settings
    │   ├── TokenSelectorView.ts     # Token list and search
    │   ├── SettingsView.ts          # Settings rows and navigation
    │   └── SendToWalletView.ts      # Send to wallet + bookmarked wallets pages
    ├── playground/                  # Playground spec files (preview mode)
    ├── dev/                         # Smoke spec(s) run in dev mode
    └── profiles/                    # Example app spec files
```

### Reporters

| Environment | Reporters |
|---|---|
| **Local** | HTML report (`playwright-report/`) + list |
| **CI** | Blob per shard (merged after) + list |

On CI, blob reports from each shard are merged into a single HTML report uploaded as a workflow artifact.

The dev-mode smoke run is unsharded, so it skips blobs: in CI it emits a JSON report
(`dev-smoke-report.json`, parsed with `jq` to build the sticky PR results comment) plus
an HTML report (`playwright-report-dev-smoke/`, uploaded as an artifact on failure). Every
run updates a single sticky comment summarising both checks: dev server start and smoke
tests. If the dev server fails to start, the comment reports the broken dev build with the
smoke suite marked "not run"; otherwise it reports the smoke result (pass or fail) with
stats — or a ⚠️ notice if the suite never produced a verdict (setup failure, cancellation).

### Selector strategy — priority order

1. **`aria-label`** — stable, semantic, preferred when already on the element
2. **Role + name** — `getByRole('button', { name: '...' })`; use `exact: true`
3. **Visible text** — for headings and labels with no role
4. **`data-testid`** — when no accessible hook exists; add to source, never for aria replacement
5. **CSS selector** — last resort for container elements

Never use MUI-generated class names — they change between builds.
