import { type ReactNode, useEffect } from 'react'
import { useHeaderStore } from '../stores/header/useHeaderStore'

export function useHeaderAction(action?: ReactNode) {
  const setAction = useHeaderStore((state) => state.setAction)
  useEffect(() => {
    const removeAction = action ? setAction(action) : undefined
    return () => {
      if (removeAction) {
        removeAction()
      }
    }
  }, [setAction, action])
}
