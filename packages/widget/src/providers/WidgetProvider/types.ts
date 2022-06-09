import { WidgetConfig } from '../../types';

export type WidgetContextProps = WidgetConfig & {
  fromChain?: number;
  toChain?: number;
};

export interface WidgetProviderProps {
  config?: WidgetConfig;
}
