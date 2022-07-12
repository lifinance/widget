import { Bridge, Exchange, Order } from '@lifi/sdk';
import { Appearance } from '../../types';

export type ValueSetter<S> = <K extends keyof S>(
  key: K,
  value: S[Extract<K, string>],
) => void;

export type ValuesSetter<S> = <K extends keyof S>(
  values: Record<K, S[Extract<K, string>]>,
) => void;

export type SettingsToolType = 'Bridges' | 'Exchanges';
export const SettingsToolTypes: SettingsToolType[] = ['Bridges', 'Exchanges'];

export interface SettingsState {
  advancedPreferences: boolean;
  appearance: Appearance;
  routePriority: Order;
  slippage: string;
  gasPrice: string;
  enabledBridges?: string[];
  _enabledBridges?: Record<string, boolean>;
  enabledExchanges?: string[];
  _enabledExchanges?: Record<string, boolean>;
}

export interface SettingsStore extends SettingsState {
  setValue: ValueSetter<SettingsState>;
  setValues: ValuesSetter<SettingsState>;
  initializeTools(toolType: SettingsToolType, tools: string[]): void;
  setTools(
    toolType: SettingsToolType,
    tools: string[],
    availableTools: (Pick<Bridge, 'key'> | Pick<Exchange, 'key'>)[],
  ): void;
}
