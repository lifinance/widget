---
name: release
description: >-
  How releases work in this repo — Changesets automation, the `chore: version
  packages` PR, the current release line and dist-tags, per-PR `release-preview`
  builds, and what each `pnpm changeset:*` root script actually does. Use when
  cutting or investigating a release, publishing a preview build for another
  team, debugging the publish workflow, or answering "which version/dist-tag is
  this on". For authoring a single changeset file, use the `changeset` skill
  instead.
---

# Releasing — widget

Releases are managed with **[Changesets](https://github.com/changesets/changesets)** (independent per-package versioning — no `fixed`/`linked`). Lerna and standard-version have been removed. Each published package owns its `CHANGELOG.md`; the root `CHANGELOG.md` is a frozen v3-era archive.

## Per-PR rule (do this on every feature/fix PR)

When a change touches a **publishable** package (not a private package, not docs-only), add a `.changeset/*.md` before committing:

```bash
pnpm changeset    # interactive: pick packages + bump type, write a summary
```

- `feat:` → **minor**, `fix:` → **patch**, breaking change → **major**.
- Do **not** author changesets for cascade-only dependents — Changesets bumps internal dependents automatically from the dependency graph. (`updateInternalDependencies: patch` — the default — re-releases a dependent on *any* bump to one of its workspace dependencies, including a patch, so its pinned version stays current.)
- Publishable packages: `@lifi/widget`, `@lifi/wallet-management`, `@lifi/widget-light`, `@lifi/widget-provider`, `@lifi/widget-provider-{bitcoin,ethereum,solana,sui,tron}`.
- Private/ignored (never need a changeset): `@lifi/widget-embedded`, `@lifi/widget-playground`, `@lifi/widget-playground-next`, `@lifi/widget-playground-vite`, examples, e2e.
- `changeset-bot` comments a reminder on any PR that edits a publishable package without a changeset (a nudge, not a hard block — the maintainer-reviewed Version PR is the real gate).

## Release line — `4.x` stable (pre-mode exited)

Changesets pre mode has been **exited** and stable **`@lifi/widget@4.0.0`** is published — npm `latest` is on the `4.x` line (the old `3.x` line is superseded). There is no `.changeset/pre.json`, so **standard semver applies**: `changeset version` bumps real `4.x` versions (`fix:` → patch, `feat:` → minor, breaking → major → `5.0.0`) and `changeset publish` publishes to the `latest` dist-tag. The historical `4.0.0-alpha.*` / `4.0.0-beta.*` prereleases remain parked under the `alpha` / `beta` dist-tags.

## How a release happens (automated)

1. Open PRs with changesets (per the rule above).
2. On merge to `main`, `.github/workflows/publish.yaml` runs the `changesets` job, which opens/updates a **`chore: version packages`** PR aggregating all pending changesets (bumps versions, regenerates per-package CHANGELOGs, refreshes the lockfile).
3. Merging that version PR triggers the `release` job: it runs `pnpm changeset:publish` (build → per-package prerelease transform → `changeset publish`) and creates GitHub Releases. npm provenance is enabled via `NPM_CONFIG_PROVENANCE=true` + OIDC (`id-token: write`).
4. The `linear-*` jobs sync the published versions into Linear, deriving version/channel from the action's `publishedPackages` output.

## Preview releases (per-PR, opt-in)

To share an unmerged PR build with other teams or external integrators, add the
**`release-preview`** label to the PR. The `preview` job in `publish.yaml` publishes a
throwaway `0.0.0-preview-<sha>` build of the changed packages to npm under the
**`preview`** dist-tag and comments the exact install command on the PR. The label is
removed after a successful publish (one-shot — re-add it to cut another preview).

- Install the **exact** version it prints (e.g. `npm i @lifi/widget@0.0.0-preview-<sha>`);
  `@preview` moves with the newest preview across PRs. `0.0.0` can never become `latest`/`beta`.
  The `<sha>` is the PR head's short commit hash, so the version traces to the exact source.
- The repo is no longer in pre mode, so the preview job snapshots the changed packages
  directly; the former `changeset pre exit` workaround (needed only while in pre mode) no
  longer applies.
- Guardrails: applying a label requires Triage+ on the repo, so external people / fork-PR
  authors can't trigger it; the same-repo guard means the published code was pushed by
  someone with Write access (forks excluded); and the job is isolated (no deploy/Linear
  secrets). This is GitHub's native label-permission gate — no in-workflow role check.

## Root scripts

- `pnpm changeset:version` — `changeset version` + `build:version` (regenerates `src/config/version.ts` for `@lifi/widget` + `@lifi/widget-light` so the committed file rides along with the `package.json` bump) + `scripts/restore-example-versions.sh` + `pnpm install --lockfile-only` + `pnpm check:write`. **The version PR intentionally does not bump example pins.** `changeset version` rewrites every in-workspace example's `@lifi/*` range to the just-bumped, not-yet-published version (and neither `ignore` nor `privatePackages.version:false` prevents this), which then breaks `pnpm install`. `scripts/restore-example-versions.sh` reverts those edits so examples stay pinned to the *published* widget (so their bundlers — notably Next.js — consume the built package rather than the widget's TS source). Bump example pins manually when you want them to track a newer release.
- `pnpm changeset:prepublish` — `pnpm build`, then `build:prerelease` across publishable packages. **This is where the publish transform runs:** `changeset publish` does flat per-package `npm publish` and does NOT run each package's `build:prerelease` lifecycle, so the transform (`scripts/prerelease.js` → `scripts/formatPackageJson.js`, rewriting entry points to `dist/esm/` and copying `README.md`) must run here.
- `pnpm changeset:publish` — `pnpm changeset:prepublish && changeset publish` (used by CI).

`workspace:*` internal deps are resolved to concrete versions by `changeset publish` at publish time; `formatPackageJson.js` leaves `dependencies` untouched. `scripts/version.js` generates `src/config/version.ts` during build for `@lifi/widget` and `@lifi/widget-light` only.
