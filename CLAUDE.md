# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

LI.FI Widget monorepo — a cross-chain DeFi swap/bridge widget supporting Ethereum, Solana, Bitcoin, and Sui ecosystems. Managed with pnpm workspaces, Lerna (independent versioning), and TypeScript composite builds.

## Commands

```bash
# Development
pnpm dev                     # Start widget-playground-vite on port 3000
pnpm dev:next                # Start Next.js playground

# Building
pnpm build                   # Build all packages (libs first, then playgrounds/embedded)

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
- **Biome** for linting and formatting (not ESLint/Prettier). Single quotes, no semicolons, 2-space indent, trailing commas (ES5).
- **Conventional commits** enforced by commitlint (`feat:`, `fix:`, `chore:`, etc.).
- **`console.log` is an error** — only `console.warn` and `console.error` are allowed (except in `examples/`).
- **`useExhaustiveDependencies`** and **`useHookAtTopLevel`** are errors.
- **No unused variables or imports** — enforced as errors.
- **widget-light must have zero `dependencies`** — all types are self-contained duplicates. Chain-specific integrations are optional peer deps exposed via subpath exports (`@lifi/widget-light/ethereum`, etc.).
- Package entry points use TypeScript source (`src/index.ts`). The `scripts/formatPackageJson.js` rewrites paths to `dist/esm/` at publish time.
- TypeScript target is ES2020, module resolution is Bundler.

## Release

Independent versioning via Lerna. Release flow:
1. `pnpm release:version` — bump versions
2. `pnpm release:build` — build all packages
3. `standard-version` — generate changelog
4. Git tag triggers GitHub Actions publish (`alpha`, `beta`, or `latest` npm tags)

`scripts/version.js` generates `src/config/version.ts` per-package during build.
