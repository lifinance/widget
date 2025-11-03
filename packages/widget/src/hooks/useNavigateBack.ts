import { useRouter } from '@tanstack/react-router'
import { useCallback } from 'react'
import { navigationRoutes } from '../utils/navigationRoutes'

export const useNavigateBack = () => {
  const router = useRouter()

  const navigateBack = useCallback(() => {
    if (router.history.length > 1) {
      router.history.go(-1)
    } else {
      router.navigate({ to: navigationRoutes.home, replace: true })
    }
  }, [router])

  return navigateBack
}
