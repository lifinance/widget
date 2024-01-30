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
    }),
    shallow,
  );

  return actions;
};
