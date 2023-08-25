import { shallow } from 'zustand/shallow';
import type { SettingsState } from '.';
import { useSettingsStore } from './useSettingsStore';

export const useSettings = <K extends keyof SettingsState>(
  keys: Array<K>,
): Pick<SettingsState, (typeof keys)[number]> => {
  return useSettingsStore(
    (state) =>
      keys.reduce(
        (values, key) => {
          values[key] = state[key];
          return values;
        },
        {} as Pick<SettingsState, (typeof keys)[number]>,
      ),
    shallow,
  );
};
