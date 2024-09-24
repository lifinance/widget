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
  enabledBridges: [],
  enabledExchanges: [],
  _enabledBridges: {},
  _enabledExchanges: {},
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
              if (!Object.hasOwn(updatedState[`_enabled${toolType}`], tool)) {
                updatedState[`_enabled${toolType}`][tool] = true;
              }
            });
            // Filter tools we no longer have
            updatedState[`_enabled${toolType}`] = Object.fromEntries(
              Object.entries(updatedState[`_enabled${toolType}`]).filter(
                ([key]) => tools.includes(key),
              ),
            );
          } else {
            tools.forEach((tool) => {
              updatedState[`_enabled${toolType}`][tool] = true;
            });
          }
          const enabledToolKeys = Object.keys(
            updatedState[`_enabled${toolType}`],
          );
          updatedState[`enabled${toolType}`] = enabledToolKeys.filter(
            (key) => updatedState[`_enabled${toolType}`][key],
          );
          updatedState[`disabled${toolType}`] = enabledToolKeys.filter(
            (key) => !updatedState[`_enabled${toolType}`][key],
          );
          return updatedState;
        });
      },
      setToolValue: (toolType, tool, value) =>
        set((state) => {
          const enabledTools = {
            ...state[`_enabled${toolType}`],
            [tool]: value,
          };
          const enabledToolKeys = Object.keys(enabledTools);
          return {
            [`_enabled${toolType}`]: enabledTools,
            [`enabled${toolType}`]: enabledToolKeys.filter(
              (key) => enabledTools[key],
            ),
            [`disabled${toolType}`]: enabledToolKeys.filter(
              (key) => !enabledTools[key],
            ),
          };
        }),
      toggleToolKeys: (toolType, toolKeys) =>
        set((state) => {
          const allKeysInCollectionEnabled = toolKeys.every(
            (toolKey) => state[`_enabled${toolType}`][toolKey],
          );

          // then toggle those keys to false
          const updatedTools = toolKeys.reduce(
            (accum, toolKey) => {
              accum[toolKey] = !allKeysInCollectionEnabled;
              return accum;
            },
            {
              ...state[`_enabled${toolType}`],
            },
          );

          const enableKeys: string[] = [];
          const disabledKeys: string[] = [];

          Object.entries(updatedTools).forEach(([key, value]) => {
            if (value) {
              enableKeys.push(key);
            } else {
              disabledKeys.push(key);
            }
          });

          return {
            [`_enabled${toolType}`]: updatedTools,
            [`enabled${toolType}`]: enableKeys,
            [`disabled${toolType}`]: disabledKeys,
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
        const {
          disabledBridges,
          disabledExchanges,
          enabledBridges,
          enabledExchanges,
          ...partializedState
        } = state;
        return partializedState;
      },
      merge: (persistedState: any, currentState: SettingsState) => {
        const state = { ...currentState, ...persistedState };
        SettingsToolTypes.forEach((toolType) => {
          const enabledToolKeys = Object.keys(
            persistedState[`_enabled${toolType}`],
          );
          state[`enabled${toolType}`] = enabledToolKeys.filter(
            (key) => persistedState[`_enabled${toolType}`][key],
          );
          state[`disabled${toolType}`] = enabledToolKeys.filter(
            (key) => !persistedState[`_enabled${toolType}`][key],
          );
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
