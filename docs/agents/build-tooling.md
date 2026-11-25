# Build tooling

- **tsdown** (powered by rolldown) builds all library packages. Config in each package's `tsdown.config.ts`.
- **Vite** builds app packages (`widget-embedded`, `widget-playground-vite`). These are NOT built with tsdown.
- **`isolatedDeclarations: true`** is enabled in root `tsconfig.json`. All exported declarations in library packages must have explicit type annotations:
  - Exported functions must have explicit return types (`: JSX.Element`, `: void`, etc.)
  - Exported `createContext<T>()` results need `Context<T>` annotation
  - Exported `styled(Component)(...)` results need `React.FC<Props>` annotation
  - Use proper `import type { Foo } from '...'` — never inline `import('...').Foo` in type positions
- `widget-embedded` and `widget-playground-vite` extend the root tsconfig, so `isolatedDeclarations` applies to them too. Only `examples/nft-checkout` sets it to `false`.
- If `check:types` shows phantom errors after tsconfig changes, delete `.tsbuildinfo` files and retry.
- Package entry points use TypeScript source (`src/index.ts`). The `scripts/formatPackageJson.js` rewrites paths to `dist/esm/` at publish time.
- Library packages use `tsdown` with `unbundle: true` mode. The widget package needs `neverBundle: [/\.json$/]` for i18n JSON files.
- **Oxfmt sorts imports** — running `pnpm check:write` may reorder import statements. This is expected. Oxfmt does not sort `export ... from` statements. Put an empty line after a side-effect import (for example `import './globals.css'`); otherwise Oxfmt can move other imports across it.
- **pnpm settings live in `pnpm-workspace.yaml` only** — pnpm 11 and later silently ignore `package.json#pnpm` and most non-auth `.npmrc` keys. Verify any setting with `pnpm config get <kebab-name>` (returns `undefined` if pnpm isn't reading it). npm publish provenance is set via `NPM_CONFIG_PROVENANCE=true` env in `.github/workflows/publish.yaml`, not pnpm config.
