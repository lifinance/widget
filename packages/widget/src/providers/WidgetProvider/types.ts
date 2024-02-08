import type { WidgetConfig } from '../../types/widget.js';

export type WidgetContextProps = WidgetConfig & {
  fromChain?: number;
  toChain?: number;
  elementId: string;
};

export interface WidgetProviderProps {
  config?: WidgetConfig;
}
