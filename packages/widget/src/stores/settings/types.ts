import type { Order } from '@lifi/sdk';
import type { PropsWithChildren } from 'react';
import type { StoreApi } from 'zustand';
import type { UseBoundStoreWithEqualityFn } from 'zustand/traditional';
import type { Appearance, SplitSubvariantOptions } from '../../types/widget.js';

export type ValueSetter<S> = <K extends keyof S>(
  key: K,
  value: S[Extract<K, string>],
) => void;

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
  enabledBridges: Record<string, boolean>;
  disabledExchanges: string[];
  enabledExchanges: Record<string, boolean>;
}

export interface SettingsState extends SettingsProps {
  setValue: ValueSetter<SettingsProps>;
  setValues: ValuesSetter<SettingsProps>;
  initializeTools(
    toolType: SettingsToolType,
    tools: string[],
    reset?: boolean,
  ): void;
  setToolValue(toolType: SettingsToolType, tool: string, value: boolean): void;
  toggleTools(toolType: SettingsToolType): void;
  reset(bridges: string[], exchanges: string[]): void;
}

export interface SendToWalletState {
  showSendToWallet: boolean;
  showSendToWalletDirty: boolean;
}

export interface SendToWalletStore extends SendToWalletState {
  toggleSendToWallet(): void;
  setSendToWallet(value: boolean): void;
}

export interface SplitSubvariantState {
  state?: SplitSubvariantOptions;
  setState(state: SplitSubvariantOptions): void;
}

export type SplitSubvariantStore = UseBoundStoreWithEqualityFn<
  StoreApi<SplitSubvariantState>
>;

export interface SplitSubvariantProps {
  state?: SplitSubvariantOptions;
}

export type SplitSubvariantProviderProps =
  PropsWithChildren<SplitSubvariantProps>;
