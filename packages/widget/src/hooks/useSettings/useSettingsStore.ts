import produce from 'immer';
import create from 'zustand';
import { persist } from 'zustand/middleware';
import shallow from 'zustand/shallow';
import { Appearance } from '../../types';
import { SettingsStore } from './types';

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      appearance: 'auto',
      setAppearance: (appearance: Appearance) =>
        set(
          produce((state: SettingsStore) => {
            state.appearance = appearance;
          }),
        ),
    }),
    {
      name: 'li.fi-widget-settings',
      version: 1,
      migrate: (persistedState: any, version) => {
        if (version === 0 && persistedState.appearance === 'system') {
          persistedState.appearance = 'auto';
        }
        return persistedState as SettingsStore;
      },
    },
  ),
);

export const useAppearance = (): [
  Appearance,
  (appearance: Appearance) => void,
] => {
  return useSettingsStore(
    (state) => [state.appearance, state.setAppearance],
    shallow,
  );
};
