import { createContext, useContext } from 'react';

export interface WidgetDrawerContext {
  closeDrawer?(): void;
}

export const DrawerContext = createContext<WidgetDrawerContext>({});

export const useDrawer = (): WidgetDrawerContext => useContext(DrawerContext);
