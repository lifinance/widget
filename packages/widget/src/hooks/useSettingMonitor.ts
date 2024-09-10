import { shallow } from 'zustand/shallow';
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js';
import {
  defaultConfigurableSettings,
  setDefaultSettings,
  useSettingsStore,
} from '../stores/settings/useSettingsStore.js';
import { useTools } from './useTools.js';

export const useSettingMonitor = () => {
  const [
    disabledBridges,
    disabledExchanges,
    routePriority,
    slippage,
    gasPrice,
  ] = useSettingsStore(
    (state) => [
      state.disabledBridges,
      state.disabledExchanges,
      state.routePriority,
      state.slippage,
      state.gasPrice,
    ],
    shallow,
  );
  const { tools } = useTools();
  const resetSettings = useSettingsStore((state) => state.reset);
  const config = useWidgetConfig();

  const isSlippageChanged = config.slippage
    ? Number(slippage) !== config.slippage * 100
    : slippage !== defaultConfigurableSettings.slippage;

  const isSlippageOutsideRecommendedLimits =
    isSlippageChanged && Number(slippage) > 1;

  const isRoutePriorityChanged = config.routePriority
    ? routePriority !== config.routePriority
    : routePriority !== defaultConfigurableSettings.routePriority;

  const isGasPriceChanged = gasPrice !== defaultConfigurableSettings.gasPrice;

  const isBridgesChanged = Boolean(disabledBridges.length);
  const isExchangesChanged = Boolean(disabledExchanges.length);

  const isCustomRouteSettings =
    isBridgesChanged ||
    isExchangesChanged ||
    isSlippageChanged ||
    isRoutePriorityChanged ||
    isGasPriceChanged;

  const isRouteSettingsWithWarnings = isSlippageOutsideRecommendedLimits;

  const reset = () => {
    if (tools) {
      resetSettings(
        tools.bridges.map((tool) => tool.key),
        tools.exchanges.map((tool) => tool.key),
      );

      setDefaultSettings(config);
    }
  };

  return {
    isBridgesChanged,
    isExchangesChanged,
    isSlippageChanged,
    isSlippageOutsideRecommendedLimits,
    isRoutePriorityChanged,
    isGasPriceChanged,
    isCustomRouteSettings,
    isRouteSettingsWithWarnings,
    reset,
  };
};
