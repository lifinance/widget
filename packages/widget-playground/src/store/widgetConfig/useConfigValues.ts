import { palette, paletteDark, paletteLight } from '@lifi/widget';
import { shallow } from 'zustand/shallow';
import { useThemeMode } from '../../hooks';
import { getValueFromPath } from '../../utils';
import { useWidgetConfigStore } from './WidgetConfigProvider';
import type { FormValues } from './types';

export const useConfigVariant = () => {
  const [variant] = useWidgetConfigStore(
    (store) => [store.config?.variant],
    shallow,
  );

  return {
    variant: !variant ? 'default' : variant,
  };
};

export const useConfigFormValues = () => {
  const [fromChain, fromToken, fromAmount, toChain, toToken, toAddress] =
    useWidgetConfigStore(
      (store) => [
        store.config?.fromChain,
        store.config?.fromToken,
        store.config?.fromAmount,
        store.config?.toChain,
        store.config?.toToken,
        store.config?.toAddress,
      ],
      shallow,
    );

  return {
    fromChain,
    fromToken,
    toChain,
    toToken,
    fromAmount,
    toAddress,
  } as FormValues;
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
  const themeMode = useThemeMode();
  const colors = useWidgetConfigStore(
    (store) =>
      paths.map((path) => getValueFromPath<string>(store.config, path)),
    shallow,
  ) as Array<string | undefined>;

  const defaultThemePalette = {
    theme: {
      palette: {
        ...palette,
        ...(themeMode === 'light' ? paletteLight : paletteDark),
      },
    },
  };

  return colors.map((color, i) => {
    if (!color) {
      return getValueFromPath<string>(defaultThemePalette, paths[i]);
    }
    return color;
  });
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

export const useThemeValues = () => {
  const [selectedThemeId, allThemesItems] = useWidgetConfigStore(
    (store) => [store.themeId, store.widgetThemeItems],
    shallow,
  );

  return {
    selectedThemeId,
    selectedThemeItem: allThemesItems.find(
      (themeItem) => themeItem.id === selectedThemeId,
    ),
    allThemesItems,
  };
};
