import { shallow } from 'zustand/shallow';
import { useWidgetConfigStore } from './WidgetConfigProvider';

export const useConfigActions = () => {
  const actions = useWidgetConfigStore(
    (state) => ({
      initialiseConfig: state.setConfig,
    }),
    shallow,
  );

  return actions;
};
