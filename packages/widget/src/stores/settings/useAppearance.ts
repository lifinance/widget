import { shallow } from 'zustand/shallow';
import type { Appearance } from '../../types/widget.js';
import { useSettingsStore } from './useSettingsStore.js';

export const useAppearance = (): [
  Appearance,
  (appearance: Appearance) => void,
] => {
  const [appearance, setValue] = useSettingsStore(
    (state) => [state.appearance, state.setValue],
    shallow,
  );
  const setAppearance = (appearance: Appearance) => {
    setValue('appearance', appearance);
  };
  return [appearance, setAppearance];
};
