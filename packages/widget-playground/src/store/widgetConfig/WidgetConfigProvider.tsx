import type { FC, PropsWithChildren } from 'react';
import { createContext, useContext, useRef } from 'react';
import { shallow } from 'zustand/shallow';
import type { WidgetConfig } from '@lifi/widget';
import type { WidgetConfigStore, WidgetConfigState } from './types.js';
import { createWidgetConfigStore } from './createWidgetConfigStore.js';

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
