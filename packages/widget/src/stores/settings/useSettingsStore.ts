import type { StateCreator } from 'zustand';
import { persist } from 'zustand/middleware';
import { createWithEqualityFn } from 'zustand/traditional';
import type { WidgetConfig } from '../../types/widget.js';
import type { SettingsProps, SettingsState } from './types.js';
import { SettingsToolTypes } from './types.js';

export const defaultSlippage = '0.5';

export const defaultConfigurableSettings: Pick<
  SettingsState,
  'routePriority' | 'slippage' | 'gasPrice'
> = {
  routePriority: 'CHEAPEST',
  slippage: defaultSlippage,
  gasPrice: 'normal',
};

export const defaultSettings: SettingsProps = {
  appearance: 'auto',
  gasPrice: 'normal',
  enabledAutoRefuel: true,
  disabledBridges: [],
  disabledExchanges: [],
  enabledBridges: {},
  enabledExchanges: {},
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
          if (!reset) {
            // Add new tools
            tools.forEach((tool) => {
              if (!Object.hasOwn(updatedState[`enabled${toolType}`], tool)) {
                updatedState[`enabled${toolType}`][tool] = true;
              }
            });
            // Filter tools we no longer have
            updatedState[`enabled${toolType}`] = Object.fromEntries(
              Object.entries(updatedState[`enabled${toolType}`]).filter(
                ([key]) => tools.includes(key),
              ),
            );
          } else {
            tools.forEach((tool) => {
              updatedState[`enabled${toolType}`][tool] = true;
            });
          }
          updatedState[`disabled${toolType}`] = Object.keys(
            updatedState[`enabled${toolType}`],
          ).filter((key) => !updatedState[`enabled${toolType}`][key]);
          return updatedState;
        });
      },
      setToolValue: (toolType, tool, value) =>
        set((state) => {
          const enabledTools = {
            ...state[`enabled${toolType}`],
            [tool]: value,
          };
          return {
            [`enabled${toolType}`]: enabledTools,
            [`disabled${toolType}`]: Object.keys(enabledTools).filter(
              (key) => !enabledTools[key],
            ),
          };
        }),
      toggleTools: (toolType) =>
        set((state) => {
          const enabledTools = { ...state[`enabled${toolType}`] };
          const enableAll = Boolean(state[`disabled${toolType}`].length);
          for (const toolKey in enabledTools) {
            enabledTools[toolKey] = enableAll;
          }
          return {
            [`enabled${toolType}`]: enabledTools,
            [`disabled${toolType}`]: enableAll ? [] : Object.keys(enabledTools),
          };
        }),
      reset: (bridges, exchanges) => {
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
      version: 4,
      partialize: (state) => {
        const { disabledBridges, disabledExchanges, ...partializedState } =
          state;
        return partializedState;
      },
      merge: (persistedState: any, currentState: SettingsState) => {
        const state = { ...currentState, ...persistedState };
        SettingsToolTypes.forEach((toolType) => {
          state[`disabled${toolType}`] = Object.keys(
            persistedState[`enabled${toolType}`],
          ).filter((key) => !persistedState[`enabled${toolType}`][key]);
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
        if (version <= 3) {
          persistedState.routePriority = 'CHEAPEST';
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
    (config?.slippage || config?.sdkConfig?.routeOptions?.slippage || 0) * 100;
  const defaultRoutePriority =
    config?.routePriority || config?.sdkConfig?.routeOptions?.order;
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
