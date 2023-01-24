import type { WidgetConfig } from '../../types';

export type WidgetContextProps = WidgetConfig & {
  fromChain?: number;
  toChain?: number;
  elementId: string;
};

export interface WidgetProviderProps {
  config?: WidgetConfig;
}
