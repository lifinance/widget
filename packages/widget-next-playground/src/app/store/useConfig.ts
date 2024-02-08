import { shallow } from 'zustand/shallow';
import { useWidgetConfigStore } from '@/app/store/WidgetConfigProvider';

export const useConfig = () => {
  const config = useWidgetConfigStore((state) => state.config, shallow);

  return {
    config,
  };
};
