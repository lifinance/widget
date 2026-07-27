# Bump rules — widget

## Bump level

- **`feat:`** (new capability, backwards-compatible) → **minor**
- **`fix:`** (bug fix, backwards-compatible) → **patch**
- **breaking change** (removed/renamed export, changed signature, behavior break) → **major**

Changesets pre mode has been **exited** — there is no `.changeset/pre.json` and the `4.x`
line is stable on the `latest` dist-tag, so standard semver applies and the level you pick
is the version that ships. See the `release` skill for the release line and dist-tags.

## Publishable packages (these need a changeset when changed)

- `@lifi/widget`
- `@lifi/wallet-management`
- `@lifi/widget-light`
- `@lifi/widget-provider`
- `@lifi/widget-provider-bitcoin`
- `@lifi/widget-provider-ethereum`
- `@lifi/widget-provider-solana`
- `@lifi/widget-provider-sui`
- `@lifi/widget-provider-tron`

## Ignored (NEVER need a changeset)

`@lifi/widget-embedded`, `@lifi/widget-playground`, `@lifi/widget-playground-next`,
`@lifi/widget-playground-vite`, everything under `examples/` and `e2e/`. These are
`private: true` and listed in `.changeset/config.json` `ignore`.

## Private but versioned (declare these too)

`@lifi/widget-checkout`, `@lifi/widget-provider-mesh`, `@lifi/widget-provider-transak` are
`private: true` but **not** in `ignore`, and `privatePackages` is unset (defaults to
`version: true`). Changesets bumps their versions and writes their CHANGELOGs; it just
doesn't publish them. Declare them like any other changed package. Move one to the
publishable list above only when its `private` flag is actually removed.

## Dependency graph — don't author cascade-only changesets

```
@lifi/widget-provider
  ↑ @lifi/widget-provider-{bitcoin,ethereum,solana,sui,tron}
  ↑ @lifi/wallet-management
  ↑ @lifi/widget
@lifi/widget-light   (standalone, zero deps)
```

`updateInternalDependencies: patch` means when you bump a package, every dependent
**re-releases automatically** with an updated range. So if you change only
`@lifi/widget-provider`, declare a changeset for **just** `@lifi/widget-provider` —
`wallet-management` and `widget` bump on their own. Authoring changesets for those
dependents double-counts and creates noisy, misleading changelogs. Declare only the
packages whose *source* you actually edited.
