import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { useHeaderStore } from '../stores/header/useHeaderStore.js'

export function useHeader(title: string, action?: ReactNode) {
  const { setTitle, setAction } = useHeaderStore((state) => state)

  useEffect(() => {
    const removeTitle = setTitle(title)
    const removeAction = action ? setAction(action) : undefined
    return () => {
      removeTitle()
      if (removeAction) {
        removeAction()
      }
    }
  }, [setTitle, setAction, action, title])
}
