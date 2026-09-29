import type { WidgetConfig } from '../types/widget.js'

// Non-empty, so an unconfigured widget never shares a host's unscoped entries.
export const defaultQueryScopeKey = 'li.fi'

type ScopeKeyConfig = Pick<
  WidgetConfig,
  'storageScopeKey' | 'queryScopeKey' | 'keyPrefix'
>

// `undefined` keeps the historical `li.fi-*` store names.
export const resolveStorageScopeKey = (
  config: Partial<ScopeKeyConfig> | undefined
): string | undefined => config?.storageScopeKey ?? config?.keyPrefix

export const resolveQueryScopeKey = (
  config: Partial<ScopeKeyConfig> | undefined
): string => config?.queryScopeKey ?? config?.keyPrefix ?? defaultQueryScopeKey
