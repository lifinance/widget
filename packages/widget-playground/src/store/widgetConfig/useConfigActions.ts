import type { WidgetConfigState } from './types.js'
import { useWidgetConfigStore } from './WidgetConfigProvider.js'

export const useConfigActions = (): Pick<
  WidgetConfigState,
  | 'setConfig'
  | 'resetConfig'
  | 'setAppearance'
  | 'setVariant'
  | 'setMode'
  | 'setBorderRadius'
  | 'resetBorderRadius'
  | 'setBorderRadiusSecondary'
  | 'resetBorderRadiusSecondary'
  | 'setColor'
  | 'setFontFamily'
  | 'setWalletConfig'
  | 'setConfigTheme'
  | 'getCurrentThemePreset'
  | 'getCurrentConfigTheme'
  | 'setHeader'
  | 'setContainer'
  | 'setFormValues'
  | 'setChainSidebarDisabled'
  | 'setSplitOption'
  | 'setPlaygroundWidgetMode'
> => {
  const actions = useWidgetConfigStore((state) => ({
    setConfig: state.setConfig,
    resetConfig: state.resetConfig,
    setAppearance: state.setAppearance,
    setVariant: state.setVariant,
    setMode: state.setMode,
    setBorderRadius: state.setBorderRadius,
    resetBorderRadius: state.resetBorderRadius,
    setBorderRadiusSecondary: state.setBorderRadiusSecondary,
    resetBorderRadiusSecondary: state.resetBorderRadiusSecondary,
    setColor: state.setColor,
    setFontFamily: state.setFontFamily,
    setWalletConfig: state.setWalletConfig,
    setConfigTheme: state.setConfigTheme,
    getCurrentThemePreset: state.getCurrentThemePreset,
    getCurrentConfigTheme: state.getCurrentConfigTheme,
    setHeader: state.setHeader,
    setContainer: state.setContainer,
    setFormValues: state.setFormValues,
    setChainSidebarDisabled: state.setChainSidebarDisabled,
    setSplitOption: state.setSplitOption,
    setPlaygroundWidgetMode: state.setPlaygroundWidgetMode,
  }))

  return actions
}
