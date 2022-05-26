import { PaletteMode } from '@mui/material';

export type Appearance = PaletteMode | 'system';

export interface SettingsStore {
  appearance: Appearance;
  setAppearance(appearance: Appearance): void;
}
