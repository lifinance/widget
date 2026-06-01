# Bump rules — widget

## Bump level

- **`feat:`** (new capability, backwards-compatible) → **minor**
- **`fix:`** (bug fix, backwards-compatible) → **patch**
- **breaking change** (removed/renamed export, changed signature, behavior break) → **major**

While the repo is in **pre-beta** (see the `release` skill's `channels.md`), every bump
lands as `4.0.0-beta.N` regardless of level — but still pick the level that *would* apply
on the stable line, because it determines the eventual stable bump on `pre exit`.

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

> `@lifi/widget-checkout` and `@lifi/widget-provider-mesh` arrive with PR #727; add them
> here when that lands.

## Private / ignored (NEVER need a changeset)

`@lifi/widget-embedded`, `@lifi/widget-playground`, `@lifi/widget-playground-next`,
`@lifi/widget-playground-vite`, everything under `examples/` and `e2e/`. These are
`private: true` and listed in `.changeset/config.json` `ignore`.

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
