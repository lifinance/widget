import { useNavigate, useRouter } from '@tanstack/react-router'
import { useCallback } from 'react'

export const useNavigateBack = () => {
  const navigate = useNavigate()
  const router = useRouter()

  const navigateBack = useCallback(
    (toPathname?: string) => {
      if (toPathname) {
        navigate({ to: toPathname })
      } else {
        router.history.go(-1)
      }
    },
    [navigate, router]
  )

  return { navigateBack, navigate }
}
