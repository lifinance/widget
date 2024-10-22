import type { WidgetConfig } from '../../types/widget.js'

export type WidgetContextProps = WidgetConfig & {
  elementId: string
}

export interface WidgetProviderProps {
  config?: WidgetConfig
}
