import { WidgetEvent } from '../types/events.js'
import { useWidgetEvents } from './useWidgetEvents.js'

export const useContactSupport = (supportId?: string): (() => void) => {
  const widgetEvents = useWidgetEvents()

  const handleContactSupport = () => {
    if (widgetEvents.listenerCount(WidgetEvent.ContactSupport) === 0) {
      window.open('https://help.li.fi', '_blank', 'nofollow noreferrer')
    } else {
      widgetEvents.emit(WidgetEvent.ContactSupport, { supportId })
    }
  }

  return handleContactSupport
}
