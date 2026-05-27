# Linear sync — widget

widget syncs **two** Linear release pipelines, one per anchor package. Secret refs must be
static YAML, so each anchor is a **static gated job pair** (a `linear-<anchor>` meta job +
a `linear-<anchor>-sync` reusable-workflow caller), not a dynamic matrix.

| Anchor package | Linear release | Secret | State |
|---|---|---|---|
| `@lifi/widget` | "Widget" | `WIDGET_LINEAR_RELEASE_ACCESS_KEY` | live |
| `@lifi/widget-checkout` | "Checkout" | `CHECKOUT_LINEAR_RELEASE_ACCESS_KEY` | **dormant** until PR #727 |

## How it works

Each meta job is gated on its anchor actually publishing:

```yaml
if: contains(needs.release.outputs.publishedPackages, '"@lifi/widget"')
```

(The quotes matter — `'"@lifi/widget"'` won't false-match `@lifi/widget-provider`.) The
meta job derives, via `jq` over `publishedPackages`:

- `full` — the published version, e.g. `4.0.0-beta.21`
- `version` — `full` with the prerelease suffix stripped, e.g. `4.0.0`
- `channel` — `alpha` / `beta` / `stable` from the suffix

The sync job calls the reusable `linear-release.yaml` with `release_name`, `version`
(stripped), `channel`, and `release_tag: '@lifi/widget@<full>'`. The reusable:

- **`sync`** — attaches merged issues to the `X.Y.Z` Linear release and records a link to
  the GitHub Release at `releases/tag/<release_tag>`.
- **`update`** + `stage` (alpha/beta) — advances the release's stage; the release stays
  open so tickets stay "Ready for Release".
- **`complete`** (stable) — closes the release, firing Linear's "on completion → Done"
  automation.

Linear releases are keyed on the **marketing `X.Y.Z`** (stripped), so all betas of `4.0.0`
attach to one "Widget 4.0.0" release and advance its stage; the stable cut completes it.

## Skip behavior

A cycle that doesn't publish `@lifi/widget` (e.g. only a provider bumped) leaves the
"Widget" anchor out of `publishedPackages`, so the Widget meta/sync jobs **skip** — no
fallback. Same for Checkout. That's intended.

## Dormant Checkout

The Checkout jobs are wired identically but their `if` never matches until
`@lifi/widget-checkout` exists and publishes (PR #727). Enabling Checkout then needs **no**
workflow change — just the package and the `CHECKOUT_LINEAR_RELEASE_ACCESS_KEY` secret.
