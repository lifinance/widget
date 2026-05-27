# Pipeline — widget (`.github/workflows/publish.yaml`)

Trigger: **`push: main`** (not tags). `concurrency: release-${{ github.ref }}`,
`cancel-in-progress: false`.

## Jobs

1. **verify** — install + checks (lint / types / build) as the release gate.
2. **changesets** — `changesets/action` with `version: pnpm changeset:version`. When
   changesets are pending it opens/refreshes the **"chore: version packages"** PR
   (bumps versions, regenerates per-package `CHANGELOG.md`, refreshes the lockfile).
   Outputs `hasChangesets`.
3. **release** — runs only when `hasChangesets == 'false'` (i.e. the version PR just
   merged, no pending changesets). Runs `publish: pnpm changeset:publish` +
   `createGithubReleases: true`; holds `id-token: write` for npm provenance (OIDC). Outputs
   `publishedPackages` (JSON `[{name,version}]`).
4. **linear-widget / linear-widget-sync** and **linear-checkout / linear-checkout-sync** —
   gated on the anchor appearing in `publishedPackages`; see `linear-sync.md`.

Per-package npm publishes, per-package git tags (`@lifi/widget@x.y.z`), and per-package
GitHub Releases are all emitted by the single `release` run.

## Why push:main, not tags

`GITHUB_TOKEN`-created tags don't retrigger workflows, and one merge that publishes N
packages must produce N tags in **one** run. Tag-as-trigger can't do that (N tags = N
runs). Inverting to `push: main` + `createGithubReleases` is the wagmi pattern.

## The transform must run in `changeset:publish`

`changeset publish` does a flat per-package `npm publish` and does **not** run each
package's `build:prerelease` lifecycle. So `changeset:prepublish` (called by
`changeset:publish`) runs the build + `scripts/prerelease.js` → `formatPackageJson.js`
(rewrites entry points to `dist/esm/`, strips dev fields, copies README). Never call
`changeset publish` bare.

## Superseded workflows

`github-release.yaml` and `npm-publish.yaml` were the old reusable publish/release steps;
they are **superseded** by `changesets/action` (`createGithubReleases` replaces
`softprops/action-gh-release`).

## OIDC re-point — do before the first publish on this pipeline

npm trusted publishing binds to `{repo, workflow_filename, job}`. Publishing moved from
`npm-publish.yaml` (job `npm-publish`) into `publish.yaml` (job `release`), so the
`job_workflow_ref` changed. **Each publishable widget package's trusted-publisher entry on
npmjs.com must be re-pointed to `publish.yaml` / `release` before the first publish**, or
OIDC silently fails. This is a maintainer action on npmjs.com (outside this repo).

## Rerun idempotency

Re-running `release` after a partial publish is safe: `changeset publish` skips
already-published versions (npm 409) and an existing tag/Release is tolerated (422).
Confirm rather than assume when recovering from a failed run.
