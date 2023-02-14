/* eslint-disable no-underscore-dangle */
import type { WidgetConfig } from '@lifi/widget';
import { createContext, useContext, useRef } from 'react';
import type { StoreApi, UseBoundStore } from 'zustand';
import type { PersistStoreProviderProps } from '../types';
import {
  createSettingsStore,
  defaultConfigurableSettings,
} from './createSettingsStore';
import type { SettingsState } from './types';

export type SettingsStore = UseBoundStore<StoreApi<SettingsState>>;

export const SettingsStoreContext = createContext<SettingsStore | null>(null);

export function SettingsStoreProvider({
  children,
  ...props
}: PersistStoreProviderProps) {
  const storeRef = useRef<SettingsStore>();
  if (!storeRef.current) {
    storeRef.current = createSettingsStore(props);
  }
  return (
    <SettingsStoreContext.Provider value={storeRef.current}>
      {children}
    </SettingsStoreContext.Provider>
  );
}

export function useSettingsStore<T>(
  selector: (state: SettingsState) => T,
  equalityFn?: (left: T, right: T) => boolean,
): T {
  const useStore = useContext(SettingsStoreContext);
  if (!useStore) {
    throw new Error(
      `You forgot to wrap your component in <${SettingsStoreProvider.name}>.`,
    );
  }
  return useStore(selector, equalityFn);
}

export function useSettingsStoreContext() {
  const useStore = useContext(SettingsStoreContext);
  if (!useStore) {
    throw new Error(
      `You forgot to wrap your component in <${SettingsStoreProvider.name}>.`,
    );
  }
  return useStore;
}

export const setDefaultSettings = (
  useSettingsStore: SettingsStore,
  config?: WidgetConfig,
) => {
  const { slippage, routePriority, setValue } = useSettingsStore.getState();
  const defaultSlippage =
    (config?.slippage ||
      config?.sdkConfig?.defaultRouteOptions?.slippage ||
      0) * 100;
  const defaultRoutePriority =
    config?.routePriority || config?.sdkConfig?.defaultRouteOptions?.order;
  defaultConfigurableSettings.slippage = (
    defaultSlippage || defaultConfigurableSettings.slippage
  )?.toString();
  defaultConfigurableSettings.routePriority =
    defaultRoutePriority || defaultConfigurableSettings.routePriority;
  if (!slippage) {
    setValue('slippage', defaultConfigurableSettings.slippage);
  }
  if (!routePriority) {
    setValue('routePriority', defaultConfigurableSettings.routePriority);
  }
};
