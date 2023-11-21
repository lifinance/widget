import {
  defaultConfigurableSettings,
  setDefaultSettings,
  useSettingsStore,
} from '../stores';
import { shallow } from 'zustand/shallow';
import { useTools } from './useTools';
import { useWidgetConfig } from '../providers';

export const useSettingMonitor = () => {
  const [enabledBridges, enabledExchanges, routePriority, slippage, gasPrice] =
    useSettingsStore(
      (state) => [
        state.enabledBridges,
        state.enabledExchanges,
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

  const isBridgesCustomised = tools?.bridges?.length !== enabledBridges?.length;

  const isExchangesCustomised =
    tools?.exchanges?.length !== enabledExchanges?.length;

  const isCustomRouteSettings =
    isBridgesCustomised ||
    isExchangesCustomised ||
    isSlippageChanged ||
    isRoutePriorityChanged ||
    isGasPriceChanged;

  const isRouteSettingsWithWarnings = isSlippageOutsideRecommendedLimits;

  const reset = () => {
    if (tools) {
      resetSettings(
        config,
        tools.bridges.map((tool) => tool.key),
        tools.exchanges.map((tool) => tool.key),
      );

      setDefaultSettings(config);
    }
  };

  return {
    isBridgesCustomised,
    isExchangesCustomised,
    isSlippageChanged,
    isSlippageOutsideRecommendedLimits,
    isRoutePriorityChanged,
    isGasPriceChanged,
    isCustomRouteSettings,
    isRouteSettingsWithWarnings,
    reset,
  };
};
