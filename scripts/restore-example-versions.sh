#!/usr/bin/env bash
# Restore example package versions after `changeset version`.
#
# `changeset version` rewrites the @lifi/* dependency ranges of every in-workspace
# example to the just-bumped, NOT-YET-PUBLISHED version (e.g. 4.0.0-beta.N+1) and
# patch-bumps the examples' own private versions. The subsequent
# `pnpm install --lockfile-only` then fails (ERR_PNPM_NO_MATCHING_VERSION) because
# that version isn't on npm yet — it's published only after the version PR merges.
#
# Examples must stay pinned to the PUBLISHED @lifi/widget so their bundlers
# (notably Next.js / webpack / Turbopack) consume the built package instead of the
# widget's TypeScript source. Changesets has no config that exempts a dependent
# from the range rewrite — `ignore` and `privatePackages.version: false` both still
# rewrite it — so we discard the auto-edits here, right after versioning.
#
# Runs only inside the automated "version packages" PR (via `changeset:version`);
# it never touches example edits made in normal feature PRs.
set -euo pipefail
ROOT="$(git rev-parse --show-toplevel)"

# Revert the auto-edited example manifests back to their committed pins...
git -C "$ROOT" checkout HEAD -- examples
# ...and drop the per-example CHANGELOG.md files Changesets generated for them.
git -C "$ROOT" clean -fq -- 'examples/*/CHANGELOG.md'

echo "restore-example-versions: reverted Changesets' example version bumps."
