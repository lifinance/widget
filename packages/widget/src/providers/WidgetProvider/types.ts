import type { WidgetConfig } from '../../types/widget.js'

export type WidgetContextProps = WidgetConfig & {
  elementId: string
  /** Always resolved by `WidgetProvider` — see `resolveQueryScopeKey`. */
  queryScopeKey: string
}

export interface WidgetProviderProps {
  config?: WidgetConfig
}
