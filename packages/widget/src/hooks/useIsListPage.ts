import { useLocation } from 'react-router-dom'
import { listPageRoutes } from '../utils/navigationRoutes'

export function useIsListPage() {
  const { pathname } = useLocation()
  return listPageRoutes.some((route) => pathname.includes(route))
}
