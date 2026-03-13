import { WidgetEvent } from '../types/events.js'
import { useWidgetEvents } from './useWidgetEvents.js'

export const useContactSupport = (supportId?: string) => {
  const widgetEvents = useWidgetEvents()

  const handleContactSupport = () => {
    if (!widgetEvents.all.has(WidgetEvent.ContactSupport)) {
      window.open('https://help.li.fi', '_blank', 'nofollow noreferrer')
    } else {
      widgetEvents.emit(WidgetEvent.ContactSupport, { supportId })
    }
  }

  return handleContactSupport
}
