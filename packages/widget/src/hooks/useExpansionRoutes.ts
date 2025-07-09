import type { PropsWithChildren } from 'react'
import type { RouteObject } from 'react-router-dom'
import { useRoutes as useDOMRoutes } from 'react-router-dom'
import { ExpansionType } from '../types/widget'
import { navigationRoutes } from '../utils/navigationRoutes'

const routes: RouteObject[] = [
  {
    path: '/',
    element: ExpansionType.Routes,
  },
  {
    path: navigationRoutes.fromToken,
    element: ExpansionType.FromChain,
  },
  {
    path: navigationRoutes.toToken,
    element: ExpansionType.ToChain,
  },
  {
    path: '*',
    element: null,
  },
]

export const useExpansionRoutes = () => {
  const element = useDOMRoutes(routes)
  return (element?.props as PropsWithChildren)?.children as ExpansionType
}
