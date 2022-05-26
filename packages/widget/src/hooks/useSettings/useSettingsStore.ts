import produce from 'immer';
import create from 'zustand';
import { persist } from 'zustand/middleware';
import shallow from 'zustand/shallow';
import { Appearance, SettingsStore } from './types';

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      appearance: 'system',
      setAppearance: (appearance: Appearance) =>
        set(
          produce((state: SettingsStore) => {
            state.appearance = appearance;
          }),
        ),
    }),
    {
      name: 'li.fi-widget-settings',
      // partialize: (state) => ({ }),
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
