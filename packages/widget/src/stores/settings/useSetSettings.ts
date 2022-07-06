import shallow from 'zustand/shallow';
import { SettingsState, ValueSetter, ValuesSetter } from './types';
import { useSettingsStore } from './useSettingsStore';

export const useSetSettings = (): [
  ValueSetter<SettingsState>,
  ValuesSetter<SettingsState>,
] => {
  return useSettingsStore(
    (state) => [state.setValue, state.setValues],
    shallow,
  );
};
