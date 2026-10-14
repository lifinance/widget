// Legacy keys: callers pass the storage scope, so instances stay apart.
export const getQueryKey = (key: string, prefix?: string) =>
  `${prefix || 'li.fi'}-widget-${key}`
