import { createWithEqualityFn } from 'zustand/traditional';
import type { WidgetConfig } from '@lifi/widget';
import type { StateCreator } from 'zustand';
import { persist } from 'zustand/middleware';
import { addValueFromPath } from '../../utils';
import type { WidgetConfigState } from './types';
import { cloneWithNonClonables } from './utils/cloneWithNonClonables';

export const createWidgetConfigStore = (initialConfig: Partial<WidgetConfig>) =>
  createWithEqualityFn<WidgetConfigState>(
    persist(
      (set, get) => ({
        defaultConfig: initialConfig,
        config: cloneWithNonClonables(initialConfig),
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
            config: cloneWithNonClonables(get().defaultConfig!),
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
            config: addValueFromPath<Partial<WidgetConfig>>(
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
        setWalletConfig: (walletConfig?) => {
          set({
            config: {
              ...get().config,
              walletConfig,
            } as WidgetConfig,
          });
        },
      }),
      {
        name: `'li.fi-playground-config`,
        version: 0,
        partialize: (state) => ({
          config: state?.config,
        }),
      },
    ) as StateCreator<WidgetConfigState, [], [], WidgetConfigState>,
    Object.is,
  );
