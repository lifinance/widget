/* eslint-disable no-underscore-dangle */
import create from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { SettingsState, SettingsStore } from './types';
import { SettingsToolTypes } from './types';

export const useSettingsStore = create<SettingsStore>()(
  persist(
    immer((set) => ({
      advancedPreferences: false,
      showDestinationWallet: false,
      appearance: 'auto',
      gasPrice: 'normal',
      routePriority: 'RECOMMENDED',
      slippage: '3',
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
      initializeTools: (toolType, tools) =>
        set((state: SettingsState) => {
          if (!tools.length) {
            return;
          }
          if (state[`_enabled${toolType}`]) {
            // Add a new tools
            const enabledTools = tools
              .filter(
                (tool) =>
                  !Object.prototype.hasOwnProperty.call(
                    state[`_enabled${toolType}`],
                    tool,
                  ),
              )
              .reduce((values, tool) => {
                values[tool] = true;
                return values;
              }, state[`_enabled${toolType}`] as Record<string, boolean>);
            // Filter tools we no longer have
            state[`_enabled${toolType}`] = Object.fromEntries(
              Object.entries(enabledTools).filter(([key]) =>
                tools.includes(key),
              ),
            );
          } else {
            state[`_enabled${toolType}`] = tools.reduce((values, tool) => {
              values[tool] = true;
              return values;
            }, {} as Record<string, boolean>);
          }
          state[`enabled${toolType}`] = Object.entries(
            state[`_enabled${toolType}`]!,
          )
            .filter(([_, value]) => value)
            .map(([key]) => key);
        }),
      setTools: (toolType, tools, availableTools) =>
        set((state: SettingsState) => {
          state[`enabled${toolType}`] = tools;
          state[`_enabled${toolType}`] = availableTools.reduce(
            (values, tool) => {
              values[tool.key] = tools.includes(tool.key);
              return values;
            },
            {} as Record<string, boolean>,
          );
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
