import type { FC, PropsWithChildren } from 'react';
import diff from 'microdiff';
import { createContext, useContext, useEffect, useRef } from 'react';
import { shallow } from 'zustand/shallow';
import type { WidgetConfig } from '@lifi/widget';
import type { WidgetConfigStore, WidgetConfigState } from './types.js';
import { createWidgetConfigStore } from './createWidgetConfigStore.js';
import isEqual from 'lodash.isequal';
import { cloneStructuredConfig } from './utils/cloneStructuredConfig';
import { patch } from '../../utils';
import { getConfigOutput } from './utils/getConfigOutput';
import { themeItems } from './themes';

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
    const themes = [
      {
        id: 'default',
        name: 'Default',
        theme: defaultWidgetConfig?.theme || {},
      },
      ...themeItems,
    ];
    storeRef.current = createWidgetConfigStore(defaultWidgetConfig, themes);
  }

  useEffect(() => {
    const currentConfig = storeRef.current?.getState().config;
    if (currentConfig && !isEqual(currentConfig, defaultWidgetConfig)) {
      storeRef.current?.getState().setDefaultConfig(defaultWidgetConfig);

      const editorConfigDefaults = getConfigOutput(defaultWidgetConfig);
      const editorConfigUpdates = getConfigOutput(currentConfig);
      const differences = diff(editorConfigDefaults, editorConfigUpdates);

      const mergedConfig = patch(
        cloneStructuredConfig<Partial<WidgetConfig>>(defaultWidgetConfig),
        differences,
      ) as Partial<WidgetConfig>;

      storeRef.current?.getState().setConfig(mergedConfig);

      // handling theme updated in the default config files
      const defaultTheme = defaultWidgetConfig.theme;

      const currentDefaultTheme = storeRef.current
        ?.getState()
        .widgetThemeItems.find(
          (themeItem) => themeItem.id === 'default',
        )?.theme;

      if (currentDefaultTheme && !isEqual(currentDefaultTheme, defaultTheme)) {
        storeRef.current
          ?.getState()
          .setAvailableThemes([
            { id: 'default', name: 'Default', theme: defaultTheme || {} },
            ...themeItems,
          ]);
      }
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
