import type { SettingsProps, SettingsState } from '../types.js'

export const getStateValues = (state: SettingsState): SettingsProps => ({
  appearance: state.appearance,
  gasPrice: state.gasPrice,
  language: state.language,
  routePriority: state.routePriority,
  enabledAutoRefuel: state.enabledAutoRefuel,
  slippage: state.slippage,
  disabledBridges: [...state.disabledBridges],
  enabledBridges: [...state.enabledBridges],
  _enabledBridges: { ...state._enabledBridges },
  disabledExchanges: [...state.disabledExchanges],
  enabledExchanges: [...state.enabledExchanges],
  _enabledExchanges: { ...state._enabledExchanges },
})
