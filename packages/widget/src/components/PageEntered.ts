import { useLocation } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useWidgetEvents } from '../hooks/useWidgetEvents.js'
import { WidgetEvent } from '../types/events.js'

export function PageEntered() {
  const location = useLocation()
  const emitter = useWidgetEvents()

  useEffect(() => {
    emitter.emit(WidgetEvent.PageEntered, location.pathname)
  }, [emitter, location.pathname])
  return null
}
