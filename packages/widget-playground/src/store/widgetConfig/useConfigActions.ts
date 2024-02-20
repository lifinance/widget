import { shallow } from 'zustand/shallow';
import { useWidgetConfigStore } from './WidgetConfigProvider';

export const useConfigActions = () => {
  const actions = useWidgetConfigStore(
    (state) => ({
      setConfig: state.setConfig,
      resetConfig: state.resetConfig,
      setAppearance: state.setAppearance,
      setVariant: state.setVariant,
      setSubvariant: state.setSubvariant,
      setBorderRadius: state.setBorderRadius,
      resetBorderRadius: state.resetBorderRadius,
      setBorderRadiusSecondary: state.setBorderRadiusSecondary,
      resetBorderRadiusSecondary: state.resetBorderRadiusSecondary,
      setColor: state.setColor,
      setFontFamily: state.setFontFamily,
      setWalletConfig: state.setWalletConfig,
    }),
    shallow,
  );

  return actions;
};
