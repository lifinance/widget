import type { FC, PropsWithChildren } from 'react';
import { createContext, useContext, useEffect, useRef } from 'react';
import { shallow } from 'zustand/shallow';
import { createEditToolsStore } from './createEditToolsStore';
import type { ToolsState, ToolsStore } from './types';
import { themeItems } from './themes';
import { useDefaultTheme } from '../widgetConfig/useDefaultTheme';
import isEqual from 'lodash.isequal';

export const EditToolsContext = createContext<ToolsStore | null>(null);

export const EditToolsProvider: FC<PropsWithChildren> = ({ children }) => {
  const storeRef = useRef<ToolsStore>();
  const { defaultTheme } = useDefaultTheme();

  if (!storeRef.current) {
    storeRef.current = createEditToolsStore({
      themeItems: [
        { id: 'default', name: 'Default', theme: defaultTheme },
        ...themeItems,
      ],
    });
  }

  useEffect(() => {
    const currentDefaultTheme = storeRef.current
      ?.getState()
      .themeControl.widgetThemeItems.find(
        (themeItem) => themeItem.id === 'default',
      )?.theme;

    if (currentDefaultTheme && !isEqual(currentDefaultTheme, defaultTheme)) {
      storeRef.current
        ?.getState()
        .setAvailableThemes([
          { id: 'default', name: 'Default', theme: defaultTheme },
          ...themeItems,
        ]);
    }
  }, [defaultTheme]);

  return (
    <EditToolsContext.Provider value={storeRef.current}>
      {children}
    </EditToolsContext.Provider>
  );
};

export function useEditToolsStore<T>(
  selector: (store: ToolsState) => T,
  equalityFunction = shallow,
) {
  const useStore = useContext(EditToolsContext);

  if (!useStore) {
    throw new Error(
      `You forgot to wrap your component in <${EditToolsProvider.name}>.`,
    );
  }

  return useStore(selector, equalityFunction);
}
