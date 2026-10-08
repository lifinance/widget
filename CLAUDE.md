# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

LI.FI Widget monorepo — a cross-chain DeFi swap/bridge widget supporting Ethereum, Solana, Bitcoin, Sui, Tron, and Stellar ecosystems, plus Zcash as a destination-only chain. Managed with pnpm workspaces, Changesets (independent versioning), and TypeScript composite builds.

## Commands

Non-obvious ones only — the rest are in root `package.json` scripts.

```bash
pnpm --filter widget-playground-vite analyze   # source-map-explorer on the built bundle
pnpm --filter @lifi/widget check:types         # single-package type check
pnpm --filter @lifi/widget test                # widget tests (widget-light has no test files yet)

# Example E2E (build → serve → Playwright render; registry in e2e/examples.json)
pnpm test:example <name>     # one example, e.g. nft-checkout (build + serve + render)
pnpm e2e:examples            # Playwright only (servers managed externally / by CI)
```

## Build Tooling

- **tsdown** (powered by rolldown) builds all library packages. Config in each package's `tsdown.config.ts`.
- **Vite** builds app packages (`widget-embedded`, `widget-playground-vite`). These are NOT built with tsdown.
- **`isolatedDeclarations: true`** is enabled in root `tsconfig.json`. All exported declarations in library packages must have explicit type annotations:
  - Exported functions must have explicit return types (`: JSX.Element`, `: void`, etc.)
  - Exported `createContext<T>()` results need `Context<T>` annotation
  - Exported `styled(Component)(...)` results need `React.FC<Props>` annotation
  - Use proper `import type { Foo } from '...'` — never inline `import('...').Foo` in type positions
- `widget-embedded` and `widget-playground-vite` extend the root tsconfig, so `isolatedDeclarations` applies to them too. Only `examples/nft-checkout` sets it to `false`.
- If `check:types` shows phantom errors after tsconfig changes, delete `.tsbuildinfo` files and retry.
- `src/config/version.ts` (widget + widget-light) is generated from `package.json` by `scripts/version.js`. Only the version PR commits a change to it. If a local `pnpm build` changes it on a feature branch, do not commit that change.
- `next build` rewrites `packages/widget-playground-next/tsconfig.json` — a generated artifact; discard, don't commit.

## Architecture

### Packages

```
widget-provider                       ← base ecosystem contexts
  ↑ widget-provider-{ethereum,solana,bitcoin,stellar,sui,tron,zcash}
  ↑ wallet-management                 ← wallet UI + connection logic
  ↑ widget                            ← the widget (MUI, Zustand, TanStack Router, i18next)
  ↑ widget-checkout                   ← checkout mode
widget-light ↔ widget-embedded        ← iframe host (zero deps) ↔ iframe guest app
widget-playground                     ← shared playground UI for widget-playground-{vite,next}
widget-provider-{mesh,transak}        ← private providers for checkout and the playground
```

### Cross-package invariants

**`@lifi/sdk` and `@lifi/types` must be single-copy in any consumer bundle** — the SDK keeps `executionState` as a module-level singleton; duplicates surface as `"Execution data not found"` errors during route execution. Use `pnpm.overrides` (in `pnpm-workspace.yaml`) or bundler `resolve.dedupe` to enforce.

**`wagmi` must likewise be single-copy** — its `WagmiProvider` React context is per-module-instance, so a version skew (e.g. a partial bump leaving `wagmi@3.6.16` beside `3.6.17`) makes the widget's provider and a consumer's `useConfig` read different contexts → `WagmiProviderNotFoundError` and crashed EVM/NFT/iframe examples. After any wagmi/connectors bump, run `pnpm dedupe` and confirm one version (`pnpm --filter <app> why wagmi` → "Found 1 version").

**`@creit.tech/stellar-wallets-kit` must likewise be single-copy** — it keeps `activeAddress`
and `selectedModuleId` in module-level preact signals, so two copies split the connection
state: the widget's menu connects into one kit while a consumer's own UI reads the other, and
signing fails with `"Please set the wallet first"`. It is a `dependencies` entry of
`@lifi/widget-provider-stellar`, so a consumer that also ships SWK can end up with two.

### widget-light iframe bridge

`widget-light` runs the widget inside an iframe (`widget-embedded`) and talks to the host page through `postMessage`. `packages/widget-light/src/shared/protocol.ts` defines the messages: the `READY`/`INIT` handshake, `CONFIG_UPDATE`, `RPC_REQUEST`/`RPC_RESPONSE` for wallet calls, and the wallet and widget events.

### widget internals

- **State**: Zustand stores in `packages/widget/src/stores/`
- **Routing**: TanStack Router with page components in `src/pages/`
- **Theming**: MUI v9 + Emotion; custom themes in `src/themes/`
- **Events**: `eventemitter3` (`widgetEvents` singleton in `src/hooks/useWidgetEvents.ts`) — clean up listeners with `.off(event, handler)` / `.removeAllListeners()`; there is no mitt-style `.all` map
- **i18n**: i18next with 17 locale files in `src/i18n/`; `en.json` types the keys

### Provider layering (widget)

QueryClient → Settings → WidgetConfig → I18n → Theme → SDK → Wallet → Store

## Conventions

- **ESM only** — all packages output to `dist/esm/`. No CJS.
- **Biome** for linting and formatting (not ESLint/Prettier). **Always run `pnpm check:write` after making changes** so Biome can auto-fix formatting.
- **Biome sorts imports** — running `pnpm check:write` may reorder import/export statements. This is expected.
- **Conventional commits** enforced by commitlint (`feat:`, `fix:`, `chore:`, etc.).
- **pnpm settings live in `pnpm-workspace.yaml` only** — pnpm v11 silently ignores `package.json#pnpm` and most non-auth `.npmrc` keys. Verify any setting with `pnpm config get <kebab-name>` (returns `undefined` if pnpm isn't reading it). npm publish provenance is set via `NPM_CONFIG_PROVENANCE=true` env in `.github/workflows/publish.yaml`, not pnpm config.
- **widget-light must have zero `dependencies`** — all types are self-contained duplicates. Chain-specific integrations are optional peer deps exposed via subpath exports (`@lifi/widget-light/ethereum`, etc.).
- Package entry points use TypeScript source (`src/index.ts`). The `scripts/formatPackageJson.js` rewrites paths to `dist/esm/` at publish time.
- Library packages use `tsdown` with `unbundle: true` mode. The widget package needs `neverBundle: [/\.json$/]` for i18n JSON files.
- **PR template** at `.github/pull_request_template.md` — always use it when creating PRs via `gh pr create`.
- `packages/widget-embedded/README.md` — main integration guide for widget-light (not a typical package readme).
- **Minimal comments** — default to no comments. Add one short line only when the *why* is non-obvious (hidden constraint, subtle invariant, SDK quirk, workaround). Never narrate what the code does, never reference the task/PR/issue, never leave multi-paragraph docstrings on internal functions.
- **Examples** (`examples/*`) are e2e-tested through the `e2e/examples.json` registry. `e2e/README.examples.md` explains the entries. Most examples pin the published `@lifi/widget`; a few build against the workspace source.

## Gotchas

- **Fresh worktree:** `pnpm check:types` fails with TS6305 until the workspace packages have a `dist/`. Run `pnpm build` once.
- **New i18n key:** add it to `en.json`. Add it as `""` at the same position in the 16 other locale files. `returnEmptyString: false` makes `""` fall back to English.
- **Playwright:** both playground configs use `reuseExistingServer: true` on fixed ports (`pnpm e2e` → 4173, `pnpm e2e:dev` → 3000). If another checkout serves one of these ports, the suite tests that app.

## Release

Changesets, independent per-package versioning. **Every PR touching a publishable package
needs a `.changeset/*.md`** (`feat:` → minor, `fix:` → patch, breaking → major) — use the
`changeset` skill to author one. Full release mechanics (version PR, dist-tags, preview
builds, `pnpm changeset:*` scripts) live in the `release` skill.
