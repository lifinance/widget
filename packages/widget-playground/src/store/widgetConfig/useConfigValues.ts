import { shallow } from 'zustand/shallow';
import { useWidgetConfigStore } from './WidgetConfigProvider';
import { getValueFromPath } from '../../utils/index.js';

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
      paths.map((path) => getValueFromPath<string>(store.config, path)),
    shallow,
  ) as Array<string | undefined>;
};

export const useConfigFontFamily = () => {
  const [fontFamily] = useWidgetConfigStore(
    (store) => [store.config?.theme?.typography?.fontFamily],
    shallow,
  );

  return {
    fontFamily,
  };
};

export const useConfigWalletManagement = () => {
  const [walletConfig, defaultWalletConfig] = useWidgetConfigStore(
    (store) => [store.config?.walletConfig, store.defaultConfig?.walletConfig],
    shallow,
  );

  const replacementWalletConfig = defaultWalletConfig
    ? defaultWalletConfig
    : { async onConnect() {} };

  return {
    isExternalWalletManagement: !!walletConfig,
    replacementWalletConfig,
  };
};
