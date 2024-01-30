import { shallow } from 'zustand/shallow';
import { useWidgetConfigStore } from './WidgetConfigProvider';

export const useConfigVariant = () => {
  const [variant] = useWidgetConfigStore(
    (store) => [store.config?.variant],
    shallow,
  );

  return {
    variant: !variant ? 'default' : variant,
  };
};

export const useConfigAppearance = () => {
  const [appearance] = useWidgetConfigStore(
    (store) => [store.config?.appearance],
    shallow,
  );

  return {
    appearance: !appearance ? 'auto' : appearance,
  };
};
