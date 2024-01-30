import { shallow } from 'zustand/shallow';
import { useWidgetConfigStore } from './WidgetConfigProvider';

export const useConfigActions = () => {
  const actions = useWidgetConfigStore(
    (state) => ({
      setConfig: state.setConfig,
      setAppearance: state.setAppearance,
      setVariant: state.setVariant,
    }),
    shallow,
  );

  return actions;
};
