import type { StateCreator } from 'zustand';
import { persist } from 'zustand/middleware';
import { createWithEqualityFn } from 'zustand/traditional';
import type { WidgetConfig } from '../../types';
import type { SettingsProps, SettingsState } from './types';
import { SettingsToolTypes } from './types';

export const defaultConfigurableSettings: Pick<
  SettingsState,
  'routePriority' | 'slippage' | 'gasPrice'
> = {
  routePriority: 'RECOMMENDED',
  slippage: '0.5',
  gasPrice: 'normal',
};

export const defaultSettings: SettingsProps = {
  appearance: 'auto',
  gasPrice: 'normal',
  enabledAutoRefuel: true,
  showDestinationWallet: true,
  enabledBridges: [],
  enabledExchanges: [],
};

export const useSettingsStore = createWithEqualityFn<SettingsState>(
  persist(
    (set, get) => ({
      ...defaultSettings,
      setValue: (key, value) =>
        set(() => ({
          [key]: value,
        })),
      setValues: (values) =>
        set((state) => {
          const updatedState: SettingsProps = { ...state };
          for (const key in values) {
            if (Object.hasOwn(state, key)) {
              updatedState[key] = values[key];
            }
          }
          return updatedState;
        }),
      initializeTools: (toolType, tools, reset) => {
        if (!tools.length) {
          return;
        }
        set((state) => {
          const updatedState = { ...state };
          if (updatedState[`_enabled${toolType}`] && !reset) {
            // Add new tools
            const enabledTools = tools
              .filter(
                (tool) =>
                  !Object.hasOwn(
                    updatedState[`_enabled${toolType}`] as object,
                    tool,
                  ),
              )
              .reduce(
                (values, tool) => {
                  values[tool] = true;
                  return values;
                },
                updatedState[`_enabled${toolType}`] as Record<string, boolean>,
              );
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
          [`_enabled${toolType}`]: availableTools.reduce(
            (values, toolKey) => {
              values[toolKey] = tools.includes(toolKey);
              return values;
            },
            {} as Record<string, boolean>,
          ),
        })),
      reset: (config, bridges, exchanges) => {
        const { appearance, ...restDefaultSettings } = defaultSettings;

        set(() => ({
          ...restDefaultSettings,
          ...defaultConfigurableSettings,
        }));
        get().initializeTools('Bridges', bridges, true);
        get().initializeTools('Exchanges', exchanges, true);
      },
    }),
    {
      name: `li.fi-widget-settings`,
      version: 2,
      partialize: (state) => {
        const { enabledBridges, enabledExchanges, ...partializedState } = state;
        return partializedState;
      },
      merge: (persistedState: any, currentState: SettingsState) => {
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
        return persistedState as SettingsState;
      },
    },
  ) as StateCreator<SettingsState, [], [], SettingsState>,
  Object.is,
);

export const setDefaultSettings = (config?: WidgetConfig) => {
  const { slippage, routePriority, setValue, gasPrice } =
    useSettingsStore.getState();
  const defaultSlippage =
    (config?.slippage ||
      config?.sdkConfig?.defaultRouteOptions?.slippage ||
      0) * 100;
  const defaultRoutePriority =
    config?.routePriority || config?.sdkConfig?.defaultRouteOptions?.order;
  defaultConfigurableSettings.slippage = (
    defaultSlippage || defaultConfigurableSettings.slippage
  )?.toString();
  defaultConfigurableSettings.routePriority =
    defaultRoutePriority || defaultConfigurableSettings.routePriority;
  if (!slippage) {
    setValue('slippage', defaultConfigurableSettings.slippage);
  }
  if (!routePriority) {
    setValue('routePriority', defaultConfigurableSettings.routePriority);
  }
  if (!gasPrice) {
    setValue('gasPrice', defaultConfigurableSettings.gasPrice);
  }
};
