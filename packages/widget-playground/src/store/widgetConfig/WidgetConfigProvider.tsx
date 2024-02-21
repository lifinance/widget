import type { FC, PropsWithChildren } from 'react';
import { createContext, useContext, useEffect, useRef } from 'react';
import { shallow } from 'zustand/shallow';
import type { WidgetConfig } from '@lifi/widget';
import type { WidgetConfigStore, WidgetConfigState } from './types.js';
import { createWidgetConfigStore } from './createWidgetConfigStore.js';
import isEqual from 'lodash.isequal';
import diff from 'microdiff';
import { getWhitelistedEditableConfig } from './utils/getWhitelistedEditableConfig';
import { applyDifferencesToObject } from './utils/applyDifferencesToObject';

export const WidgetConfigContext = createContext<WidgetConfigStore | null>(
  null,
);

interface WidgetConfigProviderProps extends PropsWithChildren {
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
    storeRef.current?.getState().setDefaultConfig(defaultWidgetConfig);

    const currentConfig = storeRef.current?.getState().config;
    if (currentConfig && !isEqual(currentConfig, defaultWidgetConfig)) {
      const updatedDefaultConfig =
        getWhitelistedEditableConfig(defaultWidgetConfig);
      const editorConfigUpdates = getWhitelistedEditableConfig(currentConfig);
      const differences = diff(updatedDefaultConfig, editorConfigUpdates);

      const mergedConfig = applyDifferencesToObject<Partial<WidgetConfig>>(
        // TODO: question: do we have a good deep clone method in the codebase to replace this?
        JSON.parse(JSON.stringify(defaultWidgetConfig)),
        differences,
      );

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
