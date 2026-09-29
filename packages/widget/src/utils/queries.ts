/**
 * Legacy string keys (`${prefix}-widget-${key}`). Being replaced by the
 * `queries/` factories, which follow wagmi's `[name, parameters]` convention
 * and carry `queryScopeKey`. Until each key moves, callers pass the storage
 * scope — the per-instance namespace `keyPrefix` used to provide — so widget
 * instances keep exactly the isolation they had.
 */
export const getQueryKey = (key: string, prefix?: string) =>
  `${prefix || 'li.fi'}-widget-${key}`
