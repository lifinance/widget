/* eslint-disable no-underscore-dangle */
import create from 'zustand';
import { persist } from 'zustand/middleware';
import type { WidgetConfig } from '../../types';
import type { SettingsState, SettingsStore } from './types';
import { SettingsToolTypes } from './types';

export const defaultConfigurableSettings: Pick<
  SettingsState,
  'routePriority' | 'slippage'
> = {
  routePriority: 'RECOMMENDED',
  slippage: '0.5',
};

export const defaultSettings: SettingsState = {
  appearance: 'auto',
  gasPrice: 'normal',
  advancedPreferences: false,
  showDestinationWallet: true,
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      ...defaultSettings,
      setValue: (key, value) =>
        set(() => ({
          [key]: value,
        })),
      setValues: (values) =>
        set((state: SettingsState) => {
          const updatedState = { ...state };
          for (const key in values) {
            if (Object.hasOwn(state, key)) {
              updatedState[key] = values[key];
            }
          }
          return updatedState;
        }),
      initializeTools: (toolType, tools) => {
        if (!tools.length) {
          return;
        }
        set((state: SettingsState) => {
          const updatedState = { ...state };
          if (updatedState[`_enabled${toolType}`]) {
            // Add a new tools
            const enabledTools = tools
              .filter(
                (tool) =>
                  !Object.hasOwn(
                    updatedState[`_enabled${toolType}`] as object,
                    tool,
                  ),
              )
              .reduce((values, tool) => {
                values[tool] = true;
                return values;
              }, updatedState[`_enabled${toolType}`] as Record<string, boolean>);
            // Filter tools we no longer have
            updatedState[`_enabled${toolType}`] = Object.fromEntries(
              Object.entries(enabledTools).filter(([key]) =>
                tools.includes(key),
              ),
            );
          } else {
            updatedState[`_enabled${toolType}`] = tools.reduce(
              (values, tool) => {
                values[tool] = true;
                return values;
              },
              {} as Record<string, boolean>,
            );
          }
          updatedState[`enabled${toolType}`] = Object.entries(
            updatedState[`_enabled${toolType}`]!,
          )
            .filter(([_, value]) => value)
            .map(([key]) => key);
          return updatedState;
        });
      },
      setTools: (toolType, tools, availableTools) =>
        set(() => ({
          [`enabled${toolType}`]: tools,
          [`_enabled${toolType}`]: availableTools.reduce((values, tool) => {
            values[tool.key] = tools.includes(tool.key);
            return values;
          }, {} as Record<string, boolean>),
        })),
    }),
    {
      name: 'li.fi-widget-settings',
      version: 2,
      partialize: (state) => {
        const { enabledBridges, enabledExchanges, ...partializedState } = state;
        return partializedState;
      },
      merge: (persistedState: any, currentState: SettingsStore) => {
        const state = { ...currentState, ...persistedState };
        SettingsToolTypes.forEach((toolType) => {
          state[`enabled${toolType}`] = Object.entries(
            persistedState[`_enabled${toolType}`],
          )
            .filter(([_, value]) => value)
            .map(([key]) => key);
        });
        return state;
      },
      migrate: (persistedState: any, version) => {
        if (version === 0 && persistedState.appearance === 'system') {
          persistedState.appearance = defaultSettings.appearance;
        }
        if (version === 1) {
          persistedState.slippage = defaultConfigurableSettings.slippage;
        }
        return persistedState as SettingsStore;
      },
    },
  ),
);

export const setDefaultSettings = (config?: WidgetConfig) => {
  const { slippage, routePriority, setValue } = useSettingsStore.getState();
  const defaultSlippage =
    (config?.slippage ||
      config?.sdkConfig?.defaultRouteOptions?.slippage ||
      0) * 100;
  const defaultRoutePriority =
    config?.routePriority || config?.sdkConfig?.defaultRouteOptions?.order;
  if (!slippage) {
    setValue(
      'slippage',
      (defaultSlippage || defaultConfigurableSettings.slippage)?.toString(),
    );
  }
  if (!routePriority) {
    setValue(
      'routePriority',
      defaultRoutePriority || defaultConfigurableSettings.routePriority,
    );
  }
};
