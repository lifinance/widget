import { type Context, createContext, useContext } from 'react'

export interface WidgetDrawerContext {
  closeDrawer?(): void
}

export const DrawerContext: Context<WidgetDrawerContext> =
  createContext<WidgetDrawerContext>({})

export const useDrawer = (): WidgetDrawerContext => useContext(DrawerContext)
