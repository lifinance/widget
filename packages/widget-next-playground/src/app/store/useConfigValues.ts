import { shallow } from 'zustand/shallow';
import { WidgetConfig } from '@lifi/widget';
import { useWidgetConfigStore } from './WidgetConfigProvider';
import { valueFromPath } from '../utils/valueFromPath';

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

export const useConfigBorderRadiusSecondary = () => {
  const [borderRadiusSecondary] = useWidgetConfigStore(
    (store) => [store.config?.theme?.shape?.borderRadiusSecondary],
    shallow,
  );

  return {
    borderRadiusSecondary,
  };
};

export const useConfigColorsFromPath = (...paths: string[]) => {
  return useWidgetConfigStore(
    (store) =>
      paths.map((path) =>
        valueFromPath<Partial<WidgetConfig>>(store.config, path),
      ),
    shallow,
  ) as Array<string | undefined>;
};
