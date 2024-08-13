import { shallow } from 'zustand/shallow';
import { useWidgetConfigStore } from './WidgetConfigProvider';

export const useConfig = () => {
  const config = useWidgetConfigStore((state) => state.config, shallow);

  return {
    config,
  };
};

export const useThemeHeader = () => {
  const header = useWidgetConfigStore(
    (state) => state.config?.theme?.header,
    shallow,
  );

  return {
    header,
  };
};
