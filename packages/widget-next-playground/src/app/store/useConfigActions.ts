import { shallow } from 'zustand/shallow';
import { useWidgetConfigStore } from './WidgetConfigProvider';

export const useConfigActions = () => {
  const actions = useWidgetConfigStore(
    (state) => ({
      setConfig: state.setConfig,
      setAppearance: state.setAppearance,
      setVariant: state.setVariant,
      setSubvariant: state.setSubvariant,
      setBorderRadius: state.setBorderRadius,
      resetBorderRadius: state.resetBorderRadius,
      setBorderRadiusSecondary: state.setBorderRadiusSecondary,
      resetBorderRadiusSecondary: state.resetBorderRadiusSecondary,
      setColor: state.setColor,
    }),
    shallow,
  );

  return actions;
};
