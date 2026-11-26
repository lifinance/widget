# AGENTS.md

This file gives guidance to AI coding agents that work in this repository.

## Repository Overview

LI.FI Widget monorepo — a cross-chain DeFi swap/bridge widget supporting Ethereum, Solana, Bitcoin, Sui, Tron, and Stellar ecosystems, plus Zcash as a destination-only chain. Managed with pnpm workspaces, Changesets (independent versioning), and TypeScript composite builds.

## Commands

Non-obvious ones only — the rest are in root `package.json` scripts.

```bash
pnpm --filter widget-playground-vite analyze   # source-map-explorer on the built bundle
pnpm --filter @lifi/widget check:types         # single-package type check
pnpm --filter @lifi/widget test                # widget tests (widget-light has no test files yet)
pnpm --filter @lifi/widget test:affected       # after a change: only tests the change affects (vitest run --since-last-run)
pnpm test                                      # before you finish: the whole suite once

# Example E2E (build → serve → Playwright render; registry in e2e/examples.json)
pnpm test:example <name>     # one example, e.g. nft-checkout (build + serve + render)
pnpm e2e:examples            # Playwright only (servers managed externally / by CI)
```

## Build Tooling

- Full build reference (tsdown, Vite, `isolatedDeclarations` rules, package entry points, Oxfmt import sorting, pnpm settings): [docs/agents/build-tooling.md](docs/agents/build-tooling.md). Read when you change exports in a library package, imports, a tsconfig, pnpm or build config.
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

The widget-light iframe bridge, widget internals (state, routing, theming, events, i18n) and provider layering: [docs/agents/architecture.md](docs/agents/architecture.md). Read when you work inside `packages/widget` or `packages/widget-light`.

## Conventions

- **ESM only** — all packages output to `dist/esm/`. No CJS.
- **Oxlint** and **Oxfmt** for linting and formatting (not ESLint/Prettier). **Always run `pnpm check:write` after making changes** so Oxlint and Oxfmt can auto-fix formatting. `pnpm check:write:unsafe` removes unused imports. It also removes `console` calls that fail `no-console`.
- **Conventional commits** enforced by commitlint (`feat:`, `fix:`, `chore:`, etc.).
- **widget-light must have zero `dependencies`** — all types are self-contained duplicates. Chain-specific integrations are optional peer deps exposed via subpath exports (`@lifi/widget-light/ethereum`, etc.).
- **PR template** at `.github/pull_request_template.md` — always use it when creating PRs via `gh pr create`.
- `packages/widget-embedded/README.md` — main integration guide for widget-light (not a typical package readme).
- **Minimal comments** — default to no comments. Add one short line only when the *why* is non-obvious (hidden constraint, subtle invariant, SDK quirk, workaround). Never narrate what the code does, never reference the task/PR/issue, never leave multi-paragraph docstrings on internal functions.
- **Examples** (`examples/*`) are e2e-tested through the `e2e/examples.json` registry. `e2e/README.examples.md` explains the entries. Most examples pin the published `@lifi/widget`; a few build against the workspace source.

## Gotchas

- **Fresh worktree:** `pnpm check:types` fails with TS6305 until the workspace packages have a `dist/`. Run `pnpm build` once.
- **i18n keys:** when you add a key to an `en.json` or change its English text, translate the key into the 16 other locale files of that folder in the same PR. Do not leave `""`. When you remove a key from `en.json`, remove it from every locale file. After you add, change or remove a key, run the locale test with `-u` to save the new English text. Only for this work, read `TRANSLATING.md` and `docs/i18n/<locale>.md` of each locale that you write. Do not read them for other work.
- **Playwright:** both playground configs use `reuseExistingServer: true` on fixed ports (`pnpm e2e` → 4173, `pnpm e2e:dev` → 3000). If another checkout serves one of these ports, the suite tests that app.

## Release

Changesets, independent per-package versioning. **Every PR touching a publishable package
needs a `.changeset/*.md`** (`feat:` → minor, `fix:` → patch, breaking → major) — use the
`changeset` skill (`.claude/skills/changeset/SKILL.md`) to author one. Full release mechanics
(version PR, dist-tags, preview builds, `pnpm changeset:*` scripts) live in the `release`
skill (`.claude/skills/release/SKILL.md`).

## Skills

Task guides live in `.claude/skills/<name>/SKILL.md`. If your agent does not load skills,
read the `SKILL.md` file before you do that task.

- `bump-packages` — the routine dependency bump.
- `changeset` — write a `.changeset/*.md` file.
- `release` — the release flow, dist-tags and preview builds.

## Ownership

Jumper squad, reviewer Eugene (`@chybisov`). Review requests: request the
reviewer above on the PR.
