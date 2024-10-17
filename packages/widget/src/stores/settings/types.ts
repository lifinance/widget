import type { Order } from '@lifi/sdk';
import type { PropsWithChildren } from 'react';
import type { StoreApi } from 'zustand';
import type { UseBoundStoreWithEqualityFn } from 'zustand/traditional';
import type { Appearance, SplitSubvariant } from '../../types/widget.js';

export type ValueSetter<S> = <K extends keyof S>(
  key: K,
  value: S[Extract<K, string>],
) => void;

export type ValueGetter<S> = <K extends keyof S>(key: K) => S[K];

export type ValuesSetter<S> = <K extends keyof S>(
  values: Record<K, S[Extract<K, string>]>,
) => void;

export const SettingsToolTypes = ['Bridges', 'Exchanges'] as const;
export type SettingsToolType = (typeof SettingsToolTypes)[number];

export interface SettingsProps {
  appearance: Appearance;
  gasPrice?: string;
  language?: string;
  routePriority?: Order;
  enabledAutoRefuel: boolean;
  slippage?: string;
  disabledBridges: string[];
  enabledBridges: string[];
  _enabledBridges: Record<string, boolean>;
  disabledExchanges: string[];
  enabledExchanges: string[];
  _enabledExchanges: Record<string, boolean>;
}

export interface SettingsActions {
  setValue: ValueSetter<SettingsProps>;
  getValue: ValueGetter<SettingsProps>;
  getSettings: () => SettingsProps;
  initializeTools(
    toolType: SettingsToolType,
    tools: string[],
    reset?: boolean,
  ): void;
  setToolValue(toolType: SettingsToolType, tool: string, value: boolean): void;
  toggleToolKeys(toolType: SettingsToolType, toolKeys: string[]): void;
  reset(bridges: string[], exchanges: string[]): void;
}

export type SettingsState = SettingsProps & SettingsActions;

export interface SendToWalletState {
  showSendToWallet: boolean;
}

export interface SendToWalletStore extends SendToWalletState {
  setSendToWallet(value: boolean): void;
}

export interface SplitSubvariantState {
  state?: SplitSubvariant;
  setState(state: SplitSubvariant): void;
}

export type SplitSubvariantStore = UseBoundStoreWithEqualityFn<
  StoreApi<SplitSubvariantState>
>;

export interface SplitSubvariantProps {
  state?: SplitSubvariant;
}

export type SplitSubvariantProviderProps =
  PropsWithChildren<SplitSubvariantProps>;
