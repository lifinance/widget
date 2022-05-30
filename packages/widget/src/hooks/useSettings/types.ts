import { Appearance } from '../../types';

export interface SettingsStore {
  appearance: Appearance;
  setAppearance(appearance: Appearance): void;
}
