import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js'
import { useSettingsActions } from '../stores/settings/useSettingsActions.js'
import {
  defaultConfigurableSettings,
  useSettingsStore,
} from '../stores/settings/useSettingsStore.js'
import { useTools } from './useTools.js'

export const useSettingMonitor = () => {
  const [
    disabledBridges,
    disabledExchanges,
    routePriority,
    slippage,
    gasPrice,
  ] = useSettingsStore((state) => [
    state.disabledBridges,
    state.disabledExchanges,
    state.routePriority,
    state.slippage,
    state.gasPrice,
  ])
  const { tools } = useTools()
  const config = useWidgetConfig()
  const { setDefaultSettings, resetSettings } = useSettingsActions()

  const isSlippageChanged = config.slippage
    ? Number(slippage) !== config.slippage * 100
    : slippage !== defaultConfigurableSettings.slippage

  const isSlippageOutsideRecommendedLimits =
    isSlippageChanged && slippage && Number(slippage) > 1

  const isSlippageUnderRecommendedLimits =
    isSlippageChanged && slippage && Number(slippage) < 0.1

  const isSlippageNotRecommended = Boolean(
    isSlippageOutsideRecommendedLimits || isSlippageUnderRecommendedLimits
  )

  const isRoutePriorityChanged = config.routePriority
    ? routePriority !== config.routePriority
    : routePriority !== defaultConfigurableSettings.routePriority

  const isGasPriceChanged = gasPrice !== defaultConfigurableSettings.gasPrice

  const isBridgesChanged = Boolean(disabledBridges.length)
  const isExchangesChanged = Boolean(disabledExchanges.length)

  const isCustomRouteSettings =
    isBridgesChanged ||
    isExchangesChanged ||
    isSlippageChanged ||
    isRoutePriorityChanged ||
    isGasPriceChanged

  const isRouteSettingsWithWarnings = isSlippageNotRecommended

  const reset = () => {
    if (tools) {
      resetSettings(
        tools.bridges.map((tool) => tool.key),
        tools.exchanges.map((tool) => tool.key)
      )

      setDefaultSettings(config)
    }
  }

  return {
    isBridgesChanged,
    isExchangesChanged,
    isSlippageChanged,
    isSlippageNotRecommended,
    isSlippageOutsideRecommendedLimits,
    isSlippageUnderRecommendedLimits,
    isRoutePriorityChanged,
    isGasPriceChanged,
    isCustomRouteSettings,
    isRouteSettingsWithWarnings,
    reset,
  }
}
