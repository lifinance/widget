import type { WidgetConfig } from '../../types/widget'

export type WidgetContextProps = WidgetConfig & {
  elementId: string
}

export interface WidgetProviderProps {
  config?: WidgetConfig
}
