import { type Context, createContext, use } from 'react'

export interface WidgetDrawerContext {
  closeDrawer?(): void
}

export const DrawerContext: Context<WidgetDrawerContext> =
  createContext<WidgetDrawerContext>({})

export const useDrawer = (): WidgetDrawerContext => use(DrawerContext)
