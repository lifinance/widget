import type { FC, PropsWithChildren } from 'react';
import { createContext, useContext, useRef } from 'react';
import { shallow } from 'zustand/shallow';
import { createEditToolsStore } from './createEditToolsStore';
import type { ToolsState, ToolsStore } from './types';

export const EditToolsContext = createContext<ToolsStore | null>(null);

export const EditToolsProvider: FC<PropsWithChildren> = ({ children }) => {
  const storeRef = useRef<ToolsStore>();

  if (!storeRef.current) {
    storeRef.current = createEditToolsStore();
  }

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
