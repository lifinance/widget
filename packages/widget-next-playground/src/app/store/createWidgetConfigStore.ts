import { createWithEqualityFn } from 'zustand/traditional';
import { WidgetConfig } from '@lifi/widget';
import { addValueFromPath } from '../utils/setValueToPath';
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
  }));
