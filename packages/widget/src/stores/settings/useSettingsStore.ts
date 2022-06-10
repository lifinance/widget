/* eslint-disable no-underscore-dangle */
import create from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { SettingsState, SettingsStore, SettingsToolTypes } from './types';

export const useSettingsStore = create<SettingsStore>()(
  persist(
    immer((set) => ({
      advancedPreferences: false,
      appearance: 'auto',
      gasPrice: 'normal',
      routePriority: 'RECOMMENDED',
      slippage: '3',
      enabledBridges: [],
      enabledExchanges: [],
      _enabledBridges: {},
      _enabledExchanges: {},
      setValue: (key, value) =>
        set((state: SettingsState) => {
          state[key] = value;
        }),
      setValues: (values) =>
        set((state: SettingsState) => {
          for (const key in values) {
            if (Object.prototype.hasOwnProperty.call(state, key)) {
              state[key] = values[key];
            }
          }
        }),
      setTools: (toolType, tools, availableTools) =>
        set((state: SettingsState) => {
          state[`enabled${toolType}`] = tools;
          state[`_enabled${toolType}`] = availableTools.reduce<
            Record<string, boolean>
          >((values, tool) => {
            values[tool.key] = tools.includes(tool.key);
            return values;
          }, {});
        }),
    })),
    {
      name: 'li.fi-widget-settings',
      version: 1,
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
          persistedState.appearance = 'auto';
        }
        return persistedState as SettingsStore;
      },
    },
  ),
);
