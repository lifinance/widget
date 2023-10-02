import type { Order } from '@lifi/sdk';
import type { PropsWithChildren } from 'react';
import type { StoreApi } from 'zustand';
import type { UseBoundStoreWithEqualityFn } from 'zustand/traditional';
import type { Appearance, WidgetConfig } from '../../types';

export type ValueSetter<S> = <K extends keyof S>(
  key: K,
  value: S[Extract<K, string>],
) => void;

export type ValuesSetter<S> = <K extends keyof S>(
  values: Record<K, S[Extract<K, string>]>,
) => void;

export type SettingsToolType = 'Bridges' | 'Exchanges';
export const SettingsToolTypes: SettingsToolType[] = ['Bridges', 'Exchanges'];

export interface SettingsProps {
  appearance: Appearance;
  gasPrice?: string;
  language?: string;
  routePriority?: Order;
  enabledAutoRefuel: boolean;
  showDestinationWallet: boolean;
  slippage?: string;
  enabledBridges: string[];
  _enabledBridges?: Record<string, boolean>;
  enabledExchanges: string[];
  _enabledExchanges?: Record<string, boolean>;
}

export interface SettingsState extends SettingsProps {
  setValue: ValueSetter<SettingsProps>;
  setValues: ValuesSetter<SettingsProps>;
  initializeTools(
    toolType: SettingsToolType,
    tools: string[],
    reset?: boolean,
  ): void;
  setTools(
    toolType: SettingsToolType,
    tools: string[],
    availableTools: string[],
  ): void;
  reset(config: WidgetConfig, bridges: string[], exchanges: string[]): void;
}

export interface SendToWalletState {
  showSendToWallet: boolean;
  showSendToWalletDirty: boolean;
}

export interface SendToWalletStore extends SendToWalletState {
  toggleSendToWallet(): void;
  setSendToWallet(value: boolean): void;
}

export type SplitSubvariantOptions = 'bridge' | 'swap';

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
