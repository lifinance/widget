# dist-tag safety — widget

**Read before any publish action.** Publishing the wrong dist-tag is the highest-risk
mistake in this migration: it can move `latest` off the stable v3 line that production
consumers install.

## Current npm dist-tags (the hazard)

| Package | `latest` | Note |
|---|---|---|
| `@lifi/widget` | **v3 (`3.40.x`)** | production consumers; MUST NOT regress |
| `@lifi/wallet-management` | **v3 (`3.22.x`)** | same |
| `@lifi/widget-light` | `4.0.0-alpha.1` | pre-existing mis-tag; leave as-is |
| `@lifi/widget-provider*` | 4.x prerelease | pre-existing; leave as-is |

`changeset publish` defaults to the **`latest`** dist-tag when **not** in pre mode. The
repo is in **pre-beta** precisely so 4.x ships under `@beta` and `latest` stays on v3.

## The rules

1. **Pre-beta must stay entered** until the deliberate stable cut. `.changeset/pre.json`
   (`tag: beta`) is committed; do not delete it or `pre exit` except to cut stable `4.0.0`
   (see `channels.md`).
2. **Verification gate after the first beta publish:** confirm `latest` did not move.
   ```bash
   npm view @lifi/widget dist-tags
   npm view @lifi/wallet-management dist-tags
   ```
   `latest` must still be `3.x`; the new build must be on `beta`. If a 4.x became `latest`
   unexpectedly, **stop and roll back**:
   ```bash
   npm dist-tag add @lifi/widget@<last-good-v3> latest
   ```
3. **Stable cut (intentional `latest` move):** `pre exit` + graduating changeset → merge
   version PR. After it, verify `latest` is now `4.0.0` on purpose.

## Reversibility

dist-tag mistakes are reversible (`npm dist-tag add <pkg>@<version> latest`). **Version
unpublish is generally NOT reversible** (npm's 72h/policy window). So the pre-mode gate +
the post-publish dist-tag check are the real safety net — not unpublish.
