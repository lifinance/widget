---
'@lifi/widget': minor
'@lifi/widget-checkout': patch
'@lifi/widget-light': minor
---

Split `keyPrefix` into `storageScopeKey` and `queryScopeKey`, and publish shared
query options at `@lifi/widget/queries`.

`keyPrefix` did two unrelated jobs: it named the widget's persisted stores in
`localStorage`, which belong to one widget instance, and it prefixed every
react-query key, which scopes data inside the host's `QueryClient`. One field
cannot have both granularities, so a host app and the widget could never share
server data such as chains and tools.

- `storageScopeKey` namespaces persisted state — bookmarks, pinned tokens,
  recent tokens, chain order and route history, the stores `keyPrefix` named.
  Store names are unchanged, so moving a value from `keyPrefix` to
  `storageScopeKey` keeps every user's saved data. Settings keep their one
  shared name. It also scopes the widget's other queries.
- `queryScopeKey` scopes the chains and tools queries. Instances and a host app
  that pass the same value share those entries.
- `keyPrefix` is deprecated and stays the fallback for both: nothing changes for
  an integration that keeps using it. With neither set, the query scope defaults
  to `'li.fi'`.

`@lifi/widget/queries` exports `getChainsQueryOptions` and
`getToolsQueryOptions` (plus their key builders), following wagmi's
`@wagmi/core/query` convention: keys are `['chains', { apiUrl, chainTypes,
scopeKey }]` and `['tools', { apiUrl, scopeKey }]`, the `queryFn` reads its
parameters from the key, and caller behaviour (`staleTime`, `select`, …) goes in
`query` and never into the key. The subpath depends only on `@lifi/sdk` at
runtime, so a host can import it without loading the widget.

The widget's chains and tools queries now use these factories. Their cache
entries hold the raw response; tools are narrowed per widget with `select`.
The widget's internal query keys are not public API, but an integration that
invalidated them by reconstructing the old `${keyPrefix}-widget-chains` string
must switch to `getChainsQueryKey` / `getToolsQueryKey`.

`@lifi/widget-checkout` names its bookmarks store from the same storage scope,
and `@lifi/widget-light` accepts `storageScopeKey`.
