# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

LI.FI Widget monorepo — a cross-chain DeFi swap/bridge widget supporting Ethereum, Solana, Bitcoin, and Sui ecosystems. Managed with pnpm workspaces, Changesets (independent versioning), and TypeScript composite builds.

## Commands

```bash
# Development
pnpm dev                     # Start widget-playground-vite on port 3000
pnpm dev:next                # Start Next.js playground

# Building
pnpm build                   # Build all packages in parallel
pnpm --filter widget-playground-vite analyze   # source-map-explorer on the built bundle

# Code Quality
pnpm check                   # Biome lint + format check
pnpm check:write             # Auto-fix Biome issues
pnpm check:types             # TypeScript check all packages in parallel
pnpm check:circular-deps     # Detect circular deps via madge

# Single-package type check
pnpm --filter @lifi/widget check:types

# Testing (vitest)
pnpm --filter @lifi/widget test        # Run widget tests
pnpm --filter @lifi/widget-light test  # Run widget-light tests

# Unused code detection
pnpm knip:check
```

## Build Tooling

- **tsdown** (powered by rolldown) builds all library packages. Config in each package's `tsdown.config.ts`.
- **Vite** builds app packages (`widget-embedded`, `widget-playground-vite`). These are NOT built with tsdown.
- **`isolatedDeclarations: true`** is enabled in root `tsconfig.json`. All exported declarations in library packages must have explicit type annotations:
  - Exported functions must have explicit return types (`: JSX.Element`, `: void`, etc.)
  - Exported `createContext<T>()` results need `Context<T>` annotation
  - Exported `styled(Component)(...)` results need `React.FC<Props>` annotation
  - Use proper `import type { Foo } from '...'` — never inline `import('...').Foo` in type positions
- App packages (`widget-embedded`, `widget-playground-vite`, `examples/`) override with `isolatedDeclarations: false` in their tsconfig.
- If `check:types` shows phantom errors after tsconfig changes, delete `.tsbuildinfo` files and retry.

## Architecture

### Package Dependency Graph

```
@lifi/widget-provider          ← base contexts (Ethereum/Solana/Bitcoin/Sui)
  ↑
@lifi/widget-provider-{ethereum,solana,bitcoin,sui}  ← chain-specific implementations
  ↑
@lifi/wallet-management        ← wallet UI + connection logic
  ↑
@lifi/widget                   ← full widget (MUI, Zustand, TanStack Router, i18next)

@lifi/widget-light             ← lightweight iframe host/guest bridge (zero dependencies)
@lifi/widget-embedded          ← Vite app that runs inside the iframe (private)
```

**`@lifi/sdk` and `@lifi/types` must be single-copy in any consumer bundle** — the SDK keeps `executionState` as a module-level singleton; duplicates surface as `"Execution data not found"` errors during route execution. Use `pnpm.overrides` (in `pnpm-workspace.yaml`) or bundler `resolve.dedupe` to enforce.

### widget-light iframe bridge

`widget-light` provides an iframe-based integration where the widget runs inside an iframe (`widget-embedded`) and communicates with the host page via `postMessage`.

**Message flow** (defined in `packages/widget-light/src/shared/protocol.ts`):
- Guest sends `READY` → Host responds with `INIT` (config + ecosystem states)
- Host sends `CONFIG_UPDATE` when config changes after init
- Guest forwards `RPC_REQUEST` → Host routes to ecosystem handler → sends `RPC_RESPONSE`
- Host pushes wallet `EVENT`s to guest when wallet state changes
- Guest sends `WIDGET_EVENT` for subscribed events → Host dispatches to `WidgetLightEventBus`
- Host sends `WIDGET_EVENT_SUBSCRIBE`/`UNSUBSCRIBE` to control which events the guest forwards

**Key modules**:
- `src/host/useWidgetLightHost.ts` — React hook managing the host side (handshake, RPC routing, config updates)
- `src/host/WidgetLightEventBus.ts` — Module-level singleton with ref-counted subscriptions
- `src/host/useWidgetLightEvents.ts` — Public hook returning `{ on, off }` emitter
- `src/guest/GuestBridge.ts` — Singleton managing guest-side communication
- `src/shared/widgetConfig.ts` — Zero-dependency serializable config types (no React nodes, no callbacks, no MUI types)
- `src/shared/widgetLightEvents.ts` — Serializable event types mirroring widget events

### widget internals

- **State**: Zustand stores in `packages/widget/src/stores/` (form, routes, chains, settings)
- **Routing**: TanStack Router with page components in `src/pages/`
- **Theming**: MUI v7 + Emotion; custom themes in `src/themes/`
- **Events**: mitt event bus (`widgetEvents` singleton in `src/hooks/useWidgetEvents.ts`)
- **i18n**: i18next with 20 language translations in `src/i18n/`

### Provider layering (widget)

QueryClient → Settings → WidgetConfig → I18n → Theme → SDK → Wallet → Store

## Conventions

- **ESM only** — all packages output to `dist/esm/`. No CJS.
- **Biome** for linting and formatting (not ESLint/Prettier). Single quotes, no semicolons, 2-space indent, trailing commas (ES5). **Always run `pnpm check:write` after making changes** so Biome can auto-fix formatting.
- **Biome sorts imports** — running `pnpm check:write` may reorder import/export statements. This is expected.
- **Conventional commits** enforced by commitlint (`feat:`, `fix:`, `chore:`, etc.).
- **pnpm settings live in `pnpm-workspace.yaml` only** — pnpm v11 silently ignores `package.json#pnpm` and most non-auth `.npmrc` keys. Verify any setting with `pnpm config get <kebab-name>` (returns `undefined` if pnpm isn't reading it). npm publish provenance is set via `NPM_CONFIG_PROVENANCE=true` env in `.github/workflows/publish.yaml`, not pnpm config.
- **`console.log` is an error** — only `console.warn` and `console.error` are allowed (except in `examples/`).
- **`useExhaustiveDependencies`** and **`useHookAtTopLevel`** are errors.
- **No unused variables or imports** — enforced as errors.
- **widget-light must have zero `dependencies`** — all types are self-contained duplicates. Chain-specific integrations are optional peer deps exposed via subpath exports (`@lifi/widget-light/ethereum`, etc.).
- Package entry points use TypeScript source (`src/index.ts`). The `scripts/formatPackageJson.js` rewrites paths to `dist/esm/` at publish time.
- TypeScript target is ES2020, module resolution is Bundler.
- Library packages use `tsdown` with `unbundle: true` mode. The widget package needs `neverBundle: [/\.json$/]` for i18n JSON files.
- **PR template** at `.github/pull_request_template.md` — always use it when creating PRs via `gh pr create`.
- `packages/widget-embedded/README.md` — main integration guide for widget-light (not a typical package readme).

## Release

Releases are managed with **[Changesets](https://github.com/changesets/changesets)** (independent per-package versioning — no `fixed`/`linked`). Lerna and standard-version have been removed. Each published package owns its `CHANGELOG.md`; the root `CHANGELOG.md` is a frozen v3-era archive.

### Per-PR rule (do this on every feature/fix PR)

When a change touches a **publishable** package (not a private package, not docs-only), add a `.changeset/*.md` before committing:

```bash
pnpm changeset    # interactive: pick packages + bump type, write a summary
```

- `feat:` → **minor**, `fix:` → **patch**, breaking change → **major**.
- Do **not** author changesets for cascade-only dependents — Changesets bumps internal dependents automatically (`updateInternalDependencies: minor`).
- Publishable packages: `@lifi/widget`, `@lifi/wallet-management`, `@lifi/widget-light`, `@lifi/widget-provider`, `@lifi/widget-provider-{bitcoin,ethereum,solana,sui,tron}`.
- Private/ignored (never need a changeset): `@lifi/widget-embedded`, `@lifi/widget-playground`, `@lifi/widget-playground-next`, `@lifi/widget-playground-vite`, examples, e2e.
- CI enforces this: `.github/workflows/changeset-check.yaml` fails any PR that edits a publishable package without adding a changeset.

### PRE-MODE — currently in `beta` (DO NOT EXIT)

The repo is in Changesets **pre mode** (`.changeset/pre.json`, `tag: beta`). While in pre mode, `changeset version` produces `4.0.0-beta.N` versions and `changeset publish` publishes under the `beta` dist-tag. `latest` on npm stays on the v3 line (`@lifi/widget@3.x`).

**NEVER run `changeset pre exit`** unless you are deliberately cutting the stable `4.0.0` release. Exiting pre mode is the single action that moves the npm `latest` tag to 4.x — do it only on purpose.

### How a release happens (automated)

1. Open PRs with changesets (per the rule above).
2. On merge to `main`, `.github/workflows/publish.yaml` runs the `changesets` job, which opens/updates a **`chore: version packages`** PR aggregating all pending changesets (bumps versions, regenerates per-package CHANGELOGs, refreshes the lockfile).
3. Merging that version PR triggers the `release` job: it runs `pnpm changeset:publish` (build → per-package prerelease transform → `changeset publish`) and creates GitHub Releases. npm provenance is enabled via `NPM_CONFIG_PROVENANCE=true` + OIDC (`id-token: write`).
4. The `linear-*` jobs sync the published versions into Linear, deriving version/channel from the action's `publishedPackages` output.

### Canary previews (per-PR, opt-in)

To share an unmerged PR build with other teams or external integrators, add the
**`release-canary`** label to the PR. The `canary` job in `publish.yaml` publishes a
throwaway `0.0.0-canary-<timestamp>` build of the changed packages to npm under the
**`canary`** dist-tag and comments the exact install command on the PR. The label is
removed after a successful publish (one-shot — re-add it to cut another canary).

- Install the **exact** version it prints (e.g. `npm i @lifi/widget@0.0.0-canary-…`);
  `@canary` moves with the newest canary across PRs. `0.0.0` can never become `latest`/`beta`.
- This repo is in **pre mode**, where `--snapshot` is disallowed — the job therefore runs
  `changeset pre exit` in the **throwaway CI checkout only** (never committed or pushed)
  before snapshotting. `.changeset/pre.json` on the branch is untouched.
- Guardrails: same-repo branches only (forks can't trigger it), the label must be applied
  by someone with write access, and the job is isolated (no deploy/Linear secrets). It mirrors
  the trust boundary of the old `pnpm release:beta` + `v*-beta.N` tag flow.

### Root scripts

- `pnpm changeset:version` — `changeset version` + `pnpm install --lockfile-only` + `pnpm check:write`.
- `pnpm changeset:prepublish` — `pnpm build`, then `build:prerelease` across publishable packages. **This is where the publish transform runs:** `changeset publish` does flat per-package `npm publish` and does NOT run each package's `build:prerelease` lifecycle, so the transform (`scripts/prerelease.js` → `scripts/formatPackageJson.js`, rewriting entry points to `dist/esm/` and copying `README.md`) must run here.
- `pnpm changeset:publish` — `pnpm changeset:prepublish && changeset publish` (used by CI).

`workspace:*` internal deps are resolved to concrete versions by `changeset publish` at publish time; `formatPackageJson.js` leaves `dependencies` untouched. `scripts/version.js` generates `src/config/version.ts` during build for `@lifi/widget` and `@lifi/widget-light` only.
