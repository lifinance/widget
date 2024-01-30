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

export const useConfigSubvariant = () => {
  const [subvariant] = useWidgetConfigStore(
    (store) => [store.config?.subvariant],
    shallow,
  );

  return {
    subvariant: !subvariant ? 'default' : subvariant,
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

export const useConfigBorderRadius = () => {
  const [borderRadius] = useWidgetConfigStore(
    (store) => [store.config?.theme?.shape?.borderRadius],
    shallow,
  );

  return {
    borderRadius,
  };
};
