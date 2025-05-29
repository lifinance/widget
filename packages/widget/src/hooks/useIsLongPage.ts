import { useLocation } from 'react-router-dom'
import { longPageRoutes } from '../utils/navigationRoutes'

export function useIsLongPage() {
  const { pathname } = useLocation()
  return longPageRoutes.some((route) => pathname.includes(route))
}
