import { createWithEqualityFn } from 'zustand/traditional';
import type { WidgetConfig, WidgetTheme } from '@lifi/widget';
import type { StateCreator } from 'zustand';
import { persist } from 'zustand/middleware';
import { addValueFromPathString, cloneStructuredConfig } from '../../utils';
import type { WidgetConfigState } from './types';
import { getLocalStorageOutput } from './utils/getLocalStorageOutput';
import type { ThemeItem } from '../editTools/types';
import { setThemeAppearanceWithFallback } from './utils/setThemeWithFallback';

export const createWidgetConfigStore = (
  initialConfig: Partial<WidgetConfig>,
  themeItems: ThemeItem[],
  prefersDarkMode: boolean,
) =>
  createWithEqualityFn<WidgetConfigState>(
    persist(
      (set, get) => ({
        defaultConfig: initialConfig,
        config: cloneStructuredConfig<Partial<WidgetConfig>>(initialConfig),
        themeId: 'default',
        widgetThemeItems: themeItems,
        setConfig: (config) => {
          set({
            config,
          });
        },
        setDefaultConfig: (defaultConfig) => {
          set({
            defaultConfig,
          });
        },
        resetConfig: () => {
          set({
            themeId: 'default',
            config: cloneStructuredConfig<Partial<WidgetConfig>>(
              get().defaultConfig!,
            ),
          });
        },
        setAppearance: (appearance) => {
          set({
            config: {
              ...get().config,
              appearance,
            },
          });
        },
        setVariant: (variant) => {
          set({
            config: {
              ...get().config,
              variant,
            },
          });
        },
        setSubvariant: (subvariant) => {
          set({
            config: {
              ...get().config,
              subvariant,
            },
          });
        },
        setBorderRadius: (radius) => {
          set({
            config: {
              ...get().config,
              theme: {
                ...get().config?.theme,
                shape: {
                  ...get().config?.theme?.shape,
                  borderRadius: radius,
                },
              },
            } as WidgetConfig,
          });
        },
        resetBorderRadius: () => {
          const shape = get().config?.theme?.shape;

          set({
            config: {
              ...get().config,
              theme: {
                ...get().config?.theme,
                shape: {
                  ...(shape?.borderRadiusSecondary
                    ? {
                        borderRadiusSecondary: shape?.borderRadiusSecondary,
                      }
                    : {}),
                },
              },
            } as WidgetConfig,
          });
        },
        setBorderRadiusSecondary: (radius) => {
          set({
            config: {
              ...get().config,
              theme: {
                ...get().config?.theme,
                shape: {
                  ...get().config?.theme?.shape,
                  borderRadiusSecondary: radius,
                },
              },
            } as WidgetConfig,
          });
        },
        resetBorderRadiusSecondary: () => {
          const shape = get().config?.theme?.shape;

          set({
            config: {
              ...get().config,
              theme: {
                ...get().config?.theme,
                shape: {
                  ...(shape?.borderRadius
                    ? {
                        borderRadius: shape?.borderRadius,
                      }
                    : {}),
                },
              },
            } as WidgetConfig,
          });
        },
        setColor: (path, color) => {
          set({
            config: addValueFromPathString<Partial<WidgetConfig>>(
              get().config,
              path,
              color,
            ),
          });
        },
        setFontFamily: (fontFamily) => {
          set({
            config: {
              ...get().config,
              theme: {
                ...get().config?.theme,
                typography: {
                  ...get().config?.theme?.typography,
                  fontFamily,
                },
              },
            } as WidgetConfig,
          });
        },
        setConfigTheme: (theme, themeId) => {
          set({
            themeId,
            config: {
              ...get().config,
              theme: cloneStructuredConfig<Partial<WidgetTheme>>(theme),
            },
          });
        },
        setWalletConfig: (walletConfig?) => {
          set({
            config: {
              ...get().config,
              walletConfig,
            } as WidgetConfig,
          });
        },
        setAvailableThemes: (themeItems) => {
          set({
            widgetThemeItems: themeItems,
          });
        },
        getCurrentThemePreset: (useDarkMode) => {
          const selectedThemeItem = get().widgetThemeItems.find(
            (themeItem) => themeItem.id === get().themeId,
          );

          if (!selectedThemeItem) {
            return;
          }

          const appearance = (
            !!get().config?.appearance && get().config?.appearance !== 'auto'
              ? get().config?.appearance
              : useDarkMode || prefersDarkMode
                ? 'dark'
                : 'light'
          ) as string;

          return selectedThemeItem.theme[appearance];
        },
      }),
      {
        name: `'li.fi-playground-config`,
        version: 1,
        partialize: (state) => ({
          config: state?.config
            ? getLocalStorageOutput(state.config)
            : undefined,
          themeId: state.themeId,
        }),
        onRehydrateStorage: () => {
          return (state) => {
            if (state) {
              if (state.config?.walletConfig) {
                const walletConfig = state.defaultConfig?.walletConfig
                  ? state.defaultConfig?.walletConfig
                  : { async onConnect() {} };
                state.setWalletConfig(walletConfig);
              }

              setThemeAppearanceWithFallback(state, prefersDarkMode);
            }
          };
        },
      },
    ) as StateCreator<WidgetConfigState, [], [], WidgetConfigState>,
    Object.is,
  );
