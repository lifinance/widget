import { createWithEqualityFn } from 'zustand/traditional';
import { WidgetConfig } from '@lifi/widget';
import { WidgetConfigState } from './types';

export const createWidgetConfigStore = (initialConfig: Partial<WidgetConfig>) =>
  createWithEqualityFn<WidgetConfigState>((set, get) => ({
    config: initialConfig,
    setConfig: (config) => {
      set({
        config,
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
  }));
