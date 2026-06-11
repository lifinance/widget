# Examples E2E Tests

Smoke tests that verify all **17 active example apps** render and function correctly after a production build. Each example is built, served, and tested in full isolation.

**17 examples · 3–4 assertions each · 4 test profiles**

---

## Running locally

### Single example

The helper script manages the full lifecycle: build → serve → test → kill.

```bash
# From repo root
pnpm test:example vite
pnpm test:example tanstack-router
pnpm test:example nft-checkout
```

### All active examples

Runs all 17 examples sequentially. Takes ~10–15 minutes.

```bash
# From repo root
pnpm test:examples
```

Reports land in `e2e/playwright-report-examples/`. Open with:

```bash
cd e2e
pnpm exec playwright show-report playwright-report-examples/
```

> `pnpm exec playwright …` only resolves from inside `e2e/`. From the repo root, use `pnpm --filter @lifi/widget-e2e exec playwright …` instead.

### Prerequisite: build workspace packages

Example apps consume `@lifi/widget`, `@lifi/wallet-management`, etc. as workspace deps that resolve to `packages/*/dist`. Stale or missing `dist/` causes runtime errors (e.g. `Class extends value undefined`). Always build packages first:

```bash
# From repo root
pnpm -r --parallel --filter './packages/**' --filter '!*-playground-*' --filter '!*-embedded' build
```

---

## Test profiles and what they assert

### `standard` profile — 13 examples

> vite, connectkit, privy, privy-ethers, rainbowkit, reown, svelte, zustand-widget-config, vue, nextjs, nextjs15, remix, react-router-7

Widget mounted at the root path `/`.

| Assertion |
|---|
| Widget root is visible (`[id^="widget-app-expanded-container"]`) |
| Exchange heading rendered |
| From and To token selector buttons visible |
| Send amount input present |
| Settings view opens with all rows visible |
| Back navigation returns to Exchange view |
| Token selector opens from From button; first token selectable |
| Token selector opens from To button; first token selectable |

### `routed` profile — 1 example

> tanstack-router

Widget mounted at a custom route (`/widget`). Same assertions as `standard`, but the test first navigates to `/widget`.

### `iframe` profile — 2 examples

> vite-iframe, vite-iframe-wagmi

Widget runs inside an `<iframe>` via `@lifi/widget-light`. The host page serves the iframe from `https://widget.li.fi`.

| Assertion |
|---|
| `<iframe>` element is present in the DOM |
| Widget root is visible inside the frame |
| Exchange heading visible inside the frame |
| Settings button clickable inside the frame |

### `nft` profile — 1 example

> nft-checkout

NFT checkout mode — a different widget variant.

| Assertion |
|---|
| Widget root is visible |
| "Checkout" heading rendered (not "Exchange") |
| "Pay with" section visible |
| No error boundary triggered |

---

## Active examples

| Example | Profile | Port | Framework |
|---|---|---|---|
| vite | standard | 4001 | Vite + React |
| connectkit | standard | 4002 | ConnectKit |
| privy | standard | 4003 | Privy |
| privy-ethers | standard | 4004 | Privy + ethers |
| rainbowkit | standard | 4005 | RainbowKit |
| reown | standard | 4006 | Reown AppKit |
| svelte | standard | 4007 | Svelte |
| zustand-widget-config | standard | 4008 | Zustand config |
| vue | standard | 4009 | Vue 3 |
| nextjs | standard | 3001 | Next.js (App Router) |
| nextjs15 | standard | 3002 | Next.js 15 |
| remix | standard | 4010 | Remix |
| react-router-7 | standard | 4011 | React Router 7 |
| tanstack-router | routed | 4012 | TanStack Router |
| vite-iframe | iframe | 4013 | LiFiWidgetLight iframe |
| vite-iframe-wagmi | iframe | 4014 | LiFiWidgetLight + wagmi |
| nft-checkout | nft | 4015 | NFT checkout |

---

## Known broken examples (not tested)

These are excluded from CI until the underlying issues are fixed. Flip `status: 'broken' → 'active'` in `examples.config.ts` to include them.

| Example | Issue | Ticket |
|---|---|---|
| `dynamic` | `vite-plugin-env-compatible` doesn't shim `process` globally — Dynamic SDK crashes | [EMB-349](https://linear.app/lifi-linear/issue/EMB-349) |
| `nuxt` | veaury's React bridge fails in Nuxt SSR production build | [EMB-350](https://linear.app/lifi-linear/issue/EMB-350) |
| `deposit-flow` | Widget error boundary fires at runtime — root never mounts | [EMB-351](https://linear.app/lifi-linear/issue/EMB-351) |

---

## Build quirks

Some examples use a non-standard build command. This is captured in `examples.config.ts` and applied automatically:

- **`buildCmd: 'vite-build'`** — skips `tsc` and invokes Vite directly. Used when the `tsc` step in `build` fails due to a MUI v7 / `@lifi/types` mismatch. Affects: `vite`, `connectkit`, `privy`, `privy-ethers`, `rainbowkit`, `reown`, `vite-iframe`.
- **`PORT` env** — `remix` and `react-router-7` need `PORT` set explicitly because their serve commands otherwise pick an unpredictable port.

---

## Adding a new example

1. Add an entry to `e2e/examples.json` — it is the single source of truth for all CI scripts and the Playwright config.
2. Assign a `profile` that matches the widget variant (`standard`, `routed`, `iframe`, or `nft`). Add a new profile spec if none fits.
3. Assign a unique `port` (avoid collisions with the table above).
4. Set `status: 'active'` to include it in CI.

The Playwright config, the CI workflow, and local scripts all read `examples.json` automatically — no other files need updating.

---

## CI

`e2e-examples.yml` runs on every PR to `main`. A `detect-changes` job determines which examples are affected:

- Change to `examples/<name>/` → runs that example only
- Change to `packages/widget/**`, `packages/wallet-management/**`, `packages/widget-provider*/**`, or `e2e/**` → runs all 17 examples

Each affected example runs as an isolated parallel matrix job. A sticky PR comment lists any failures with a link to the workflow run.
