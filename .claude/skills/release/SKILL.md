---
name: release
description: >-
  Cut and manage releases for the widget monorepo (Changesets + wagmi model).
  Use this when the user wants to release/publish widget packages, asks about
  the "version packages" PR, dist-tags, alpha/beta/stable channels, the npm
  publish pipeline, the Linear release sync, or how a merge becomes published
  npm packages + GitHub Releases. Covers the maintainer flow, the pre-beta
  channel state, and the dist-tag safety rules specific to this repo.
---

# Releasing widget

widget publishes with **Changesets** on the wagmi model: releases are driven by
`push: main`, not by tags. There is **no single repo version tag** — each package gets its
own `@scope/pkg@x.y.z` tag and GitHub Release, all created in one publish run.

## The flow at a glance

1. PRs land on `main`, each carrying a changeset (see the `changeset` skill).
2. `.github/workflows/publish.yaml` `changesets` job opens/updates a **"chore: version
   packages"** PR that bumps versions + writes per-package `CHANGELOG.md`s.
3. Merging that PR → the `release` job runs `pnpm changeset:publish` (build → per-package
   prerelease transform → `changeset publish`), publishes to npm with provenance, and
   creates per-package GitHub Releases.
4. `linear-*` jobs sync the published versions into Linear.

Read the reference for the part you're working on:

- **`references/pipeline.md`** — the workflow jobs, what triggers what, idempotency on rerun.
- **`references/channels.md`** — alpha/beta/stable/canary via Changesets `pre` mode, and the
  **current pre-beta state** + the one rule that must not be broken.
- **`references/dist-tags.md`** — the npm dist-tag safety map (v3 is on `latest`!) and the
  cutover sequence. **Read this before any publish action.**
- **`references/linear-sync.md`** — this repo's two Linear anchors (Widget + Checkout) and
  how version/channel are derived.

## This repo's release state (the things to keep in your head)

- **Pre-beta.** `.changeset/pre.json` (`tag: beta`) is committed. `latest` on npm is the
  **v3** line; 4.x ships under `@beta`. **Never `changeset pre exit`** except to
  deliberately cut stable `4.0.0` — that is the single action that moves `latest` to 4.x.
- **Two Linear anchors:** `@lifi/widget` → "Widget", `@lifi/widget-checkout` → "Checkout".
  The Checkout job is **dormant** until PR #727 ships that package.
- **OIDC trusted publishing** (no npm token). The publishing workflow filename
  (`publish.yaml`) and job are bound to npmjs trusted-publisher config — see
  `references/pipeline.md` for the re-point caveat before the first publish on this branch.
