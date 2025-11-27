import { useLocation } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useWidgetEvents } from '../hooks/useWidgetEvents'
import { WidgetEvent } from '../types/events'

export function PageEntered() {
  const location = useLocation()
  const emitter = useWidgetEvents()

  useEffect(() => {
    emitter.emit(WidgetEvent.PageEntered, location.pathname)
  }, [emitter, location.pathname])
  return null
}
