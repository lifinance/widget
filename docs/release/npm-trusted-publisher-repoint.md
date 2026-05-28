# npm Trusted Publisher Re-point — widget

**One-time operational checklist.** Required before the **first** real publish from
`ci/changesets-migration` (or any branch where this migration has landed). Skip this and
OIDC will silently fail when the `release` job tries to publish to npm — the publish step
errors out instead of authenticating.

## Why this is required

npm Trusted Publishing binds to `{owner, repo, workflow filename, optional environment}`.
Before this migration, the publishing step lived in **reusable `npm-publish.yaml`**, so
every publishable widget package's npmjs Trusted Publisher entry pointed at
`npm-publish.yaml`. The migration **collapsed publish into `publish.yaml`** (job `release`
via `changesets/action`), so the **workflow filename changed** — the existing trusted
publisher entries no longer match the workflow that runs publish, and npm will reject the
OIDC token.

| | Before | After |
|---|---|---|
| Workflow filename | `npm-publish.yaml` | **`publish.yaml`** ← update this |
| Job | `npm-publish` | `release` (filename is what npmjs binds to, so this is informational) |
| Trigger | `workflow_call` from `publish.yaml` | `push: main` directly |
| Repo / owner | `lifinance/widget` | `lifinance/widget` (unchanged) |

## Who does this

A user with **admin/owner access to the `@lifi` npm scope** (or a per-package maintainer
with the right role on each package below). It cannot be done by Claude or by a GitHub
Actions workflow — it requires interactive login to npmjs.com.

## Packages requiring re-point (9 total)

- `@lifi/widget`
- `@lifi/wallet-management`
- `@lifi/widget-light`
- `@lifi/widget-provider`
- `@lifi/widget-provider-bitcoin`
- `@lifi/widget-provider-ethereum`
- `@lifi/widget-provider-solana`
- `@lifi/widget-provider-sui`
- `@lifi/widget-provider-tron`

If/when `@lifi/widget-checkout` and `@lifi/widget-provider-mesh` arrive with PR #727,
add their trusted publisher entries against `publish.yaml` at the same time.

## Steps (per package)

1. **Sign in** to [https://www.npmjs.com](https://www.npmjs.com) as a maintainer of the
   `@lifi` scope.
2. **Navigate** to the package settings — Access tab:
   `https://www.npmjs.com/package/<scoped-name>/access`
   (e.g. `https://www.npmjs.com/package/@lifi/widget/access`).
3. Scroll to **Trusted Publisher**. The existing entry should show
   `lifinance/widget` + workflow `npm-publish.yaml`.
4. Click **Edit** (or **Remove** and re-add — npm currently surfaces "Remove" more
   reliably than in-place edit). Fill in the new entry:
   - **Publisher:** GitHub Actions
   - **Organization or user:** `lifinance`
   - **Repository:** `widget`
   - **Workflow filename:** `publish.yaml`  ← the change
   - **Environment:** *(leave blank — the new `release` job does not use a GitHub
     environment)*
5. **Save.** npm will require a 2FA re-confirmation; have your authenticator ready.
6. Repeat for the remaining 8 packages.

## Verification (before merging the migration PR)

After updating all 9 entries, before merging `ci/changesets-migration`:

1. Confirm each entry reads `workflow filename: publish.yaml`:
   - quick visual: `https://www.npmjs.com/package/<name>/access` for each.
2. Verify no entry still points at `npm-publish.yaml`. (Stale entries are not exploitable
   on their own, since the matching workflow file is deleted by this PR — but they will
   confuse the next person.)

## Verification (after the first real publish)

The first publish that flows through `publish.yaml`/`release` will surface any
mis-configured entry as an OIDC failure. Watch the `release` job logs:

- **Success** looks like: `npm publish --provenance --access public` returns 200, and
  `npm view @lifi/widget@<new-version> --json | jq '.dist.attestations'` reports
  provenance signed by `https://github.com/lifinance/widget/.github/workflows/publish.yaml`.
- **Failure** looks like: `npm error code E403` / `npm error 403 Forbidden` /
  `npm error This package requires that publishers... authenticate via OIDC trusted publishing`.

If you see a 403 on any package, the most likely cause is that package's entry still points
at `npm-publish.yaml`. Fix the entry (steps above) and **re-run the failed `release` job** —
`changeset publish` skips packages already on npm and retries the ones that failed, so it
is safe to re-run.

## Rollback

If something goes badly wrong and you need to abort:

1. The current branches haven't been pushed; closing the PR keeps `main` on the old
   Lerna+tag pipeline.
2. If the PR was already merged and a publish failed, **the trusted publisher entries
   themselves can be re-pointed back to `npm-publish.yaml`** — but doing so leaves you on
   a half-migrated state. Better to fix forward (the publish 403 doesn't damage the npm
   registry; the new versions just haven't shipped yet).

## After the first successful publish

Delete this file (it has served its purpose) or move it to the team's runbook archive.
The recurring `release` skill (`.claude/skills/release/references/pipeline.md`) carries
the steady-state OIDC documentation.
