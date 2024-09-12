import type { WidgetConfig } from '../../types/widget.js';

export type WidgetContextProps = WidgetConfig & {
  fromChain?: number | null;
  toChain?: number | null;
  elementId: string;
};

export interface WidgetProviderProps {
  config?: WidgetConfig;
}
