import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useHeaderStore } from '../stores/header/useHeaderStore.js'

export function useHeader(title: string, action?: ReactNode) {
  const { setTitle, setAction } = useHeaderStore((state) => state)
  const { i18n } = useTranslation()

  useEffect(() => {
    const removeTitle = setTitle(i18n.language === 'empty' ? '' : title)
    const removeAction = action ? setAction(action) : undefined
    return () => {
      removeTitle()
      if (removeAction) {
        removeAction()
      }
    }
  }, [setTitle, setAction, action, title, i18n.language])
}
