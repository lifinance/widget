import { WidgetConfig } from '../../types';

export interface WidgetContextProps extends WidgetConfig {
  fromChain?: number;
  toChain?: number;
}

export interface WidgetProviderProps {
  config: WidgetConfig;
}
