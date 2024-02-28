import type { FC, PropsWithChildren } from 'react';
import diff from 'microdiff';
import { createContext, useContext, useEffect, useRef } from 'react';
import { shallow } from 'zustand/shallow';
import type { WidgetConfig } from '@lifi/widget';
import type { WidgetConfigStore, WidgetConfigState } from './types.js';
import { createWidgetConfigStore } from './createWidgetConfigStore.js';
import isEqual from 'lodash.isequal';
import { getWhitelistedConfig } from './utils/getWhitelistedConfig';
import { cloneStructuredConfig } from './utils/cloneStructuredConfig';
import { patch } from '../../utils';

export const WidgetConfigContext = createContext<WidgetConfigStore | null>(
  null,
);

export interface WidgetConfigProviderProps extends PropsWithChildren {
  defaultWidgetConfig: Partial<WidgetConfig>;
}

export const WidgetConfigProvider: FC<WidgetConfigProviderProps> = ({
  children,
  defaultWidgetConfig,
}) => {
  const storeRef = useRef<WidgetConfigStore>();

  if (!storeRef.current) {
    storeRef.current = createWidgetConfigStore(defaultWidgetConfig);
  }

  useEffect(() => {
    const currentConfig = storeRef.current?.getState().config;
    if (currentConfig && !isEqual(currentConfig, defaultWidgetConfig)) {
      storeRef.current?.getState().setDefaultConfig(defaultWidgetConfig);

      const editorConfigDefaults = getWhitelistedConfig(defaultWidgetConfig);
      const editorConfigUpdates = getWhitelistedConfig(currentConfig);
      const differences = diff(editorConfigDefaults, editorConfigUpdates);

      const mergedConfig = patch(
        cloneStructuredConfig(defaultWidgetConfig),
        differences,
      ) as Partial<WidgetConfig>;

      storeRef.current?.getState().setConfig(mergedConfig);
    }
  }, [defaultWidgetConfig]);

  return (
    <WidgetConfigContext.Provider value={storeRef.current}>
      {children}
    </WidgetConfigContext.Provider>
  );
};

export function useWidgetConfigStore<T>(
  selector: (store: WidgetConfigState) => T,
  equalityFunction = shallow,
) {
  const useStore = useContext(WidgetConfigContext);

  if (!useStore) {
    throw new Error(
      `You forgot to wrap your component in <${WidgetConfigProvider.name}>.`,
    );
  }

  return useStore(selector, equalityFunction);
}
